// import { UssdRepository } from "../repository.js";
// import type { UssdSession } from "../repository.js";
// import { PredictionService } from "../../predictions/service.js";

// export class FlowEngine {
//   constructor(private repo: UssdRepository) {}

//   async run(flow: any, steps: string[], phoneNumber: string): Promise<string> {
//     let session: UssdSession = (await this.repo.getSession(phoneNumber)) ?? {
//       step: flow.start,
//       data: {},
//     };

//     const latestInput = steps[steps.length - 1];
//     const currentStepKey = session.step;
//     const currentStep = flow.steps[currentStepKey];

//     if (!latestInput) {
//       return typeof currentStep.prompt === "function"
//         ? currentStep.prompt(
//             session.data.role,
//             session.data.name,
//             session.data.location,
//           )
//         : currentStep.prompt;
//     }

//     // Steps without a validate fn (pure action steps) skip this check
//     if (currentStep.validate && !currentStep.validate(latestInput)) {
//       return currentStep.error;
//     }

//     // transform now receives session.data, so steps can bundle/resolve values
//     const value = currentStep.transform
//       ? currentStep.transform(latestInput, session.data)
//       : latestInput;

//     session.data[currentStepKey] = value;

//     // saveAs lets a step stash its resolved value under a known key
//     // (e.g. "selectedListingId") instead of just the step name
//     if (currentStep.saveAs) {
//       session.data[currentStep.saveAs] = value;
//     }

//     if (currentStep.action) {
//       return this.executeAction(
//         currentStep.action,
//         session,
//         phoneNumber,
//         latestInput,
//         value,
//       );
//     }

//     const nextKey =
//       typeof currentStep.next === "function"
//         ? currentStep.next(latestInput)
//         : currentStep.next;

//     session.step = nextKey;
//     const nextStep = flow.steps[nextKey];

//     // Action-only steps with nothing left to collect fire immediately —
//     // no point showing a screen just to wait for input it doesn't need
//     if (nextStep.action && !nextStep.validate) {
//       return this.executeAction(
//         nextStep.action,
//         session,
//         phoneNumber,
//         latestInput,
//         value,
//       );
//     }

//     await this.repo.saveSession(phoneNumber, session);

//     if (nextStep.isTerminal) {
//       await this.repo.deleteSession(phoneNumber);
//     }

//     return typeof nextStep.prompt === "function"
//       ? nextStep.prompt(
//           session.data.role,
//           session.data.name,
//           session.data.location,
//         )
//       : nextStep.prompt;
//   }

//   private async executeAction(
//     action: string,
//     session: UssdSession,
//     phoneNumber: string,
//     latestInput: string,
//     value: string,
//   ): Promise<string> {
//     switch (action) {
//       case "CREATE_USER": {
//         if (session.data.pin !== latestInput) {
//           return "CON PINs do not match. Please start again.";
//         }
//         const { name, location, role, pin } = session.data;
//         if (!name || !location || !role || !pin) {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Something went wrong. Please try again.";
//         }
//         await this.repo.createUser({
//           phoneNumber,
//           name,
//           location,
//           role: role as any,
//           pin,
//         });
//         await this.repo.deleteSession(phoneNumber);
//         return "END Registration successful! Welcome to AgroBridge.";
//       }

//       case "PREDICT_PRICE": {
//         // use `value`, not latestInput — value carries the transformed
//         // "crop|state" bundle when predictionFlow set it; falls back to
//         // the raw input untouched for flows with no transform (buyer/agent)
//         const parts = value.split("|");
//         const commodity = parts[0]?.trim();
//         const state = parts[1]?.trim() ?? "Lagos";

//         if (!commodity) {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Invalid input. Please try again.";
//         }
//         try {
//           const predictionService = new PredictionService();
//           const result = await predictionService.predict({ commodity, state });
//           await this.repo.deleteSession(phoneNumber);
//           return `END ${result.commodity} in ${result.state}\nTrend: ${result.direction}\n${result.advice}`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Price prediction unavailable. Try again later.";
//         }
//       }

//       case "BEST_TIME": {
//         try {
//           const predictionService = new PredictionService();
//           const result = await predictionService.bestTime(latestInput.trim());
//           await this.repo.deleteSession(phoneNumber);
//           return `END Best time to sell ${result.commodity}:\n${result.best_month_to_sell}`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not fetch best time. Try again later.";
//         }
//       }

//       case "MY_INCOMING_ORDERS": {
//         try {
//           const orders = await this.repo.getIncomingOrders(phoneNumber);
//           if (!orders.length) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END You have no incoming orders.";
//           }
//           const lines = orders
//             .slice(0, 3)
//             .map(
//               (o: any, i: number) =>
//                 `${i + 1}. ${o.listing.crop} ${o.quantity}kg - NGN ${o.totalPrice}\n   Buyer: ${o.buyer.name}`,
//             )
//             .join("\n");

//           session.data.orderIds = orders
//             .slice(0, 3)
//             .map((o: any) => o.id)
//             .join(",");
//           session.step = "orderAction";
//           await this.repo.saveSession(phoneNumber, session);
//           return `CON Incoming Orders:\n${lines}\n\nSelect order number or 0 to go back`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not fetch orders. Try again.";
//         }
//       }

//       case "CONFIRM_ORDER": {
//         try {
//           const orderId = session.data.selectedOrderId;
//           if (!orderId) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END Session expired. Please try again.";
//           }
//           const result = await this.repo.confirmOrder(orderId);
//           await this.repo.deleteSession(phoneNumber);
//           if (!result.ok) return `END ${result.message}`;
//           return `END Order confirmed.\n${result.crop} ${result.quantity}kg to ${result.buyerName}.\nAwaiting buyer payment.`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not confirm order. Try again.";
//         }
//       }

//       case "CANCEL_ORDER": {
//         try {
//           const orderId = session.data.selectedOrderId;
//           if (!orderId) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END Session expired. Please try again.";
//           }
//           await this.repo.updateOrderStatus(orderId, "CANCELLED");
//           await this.repo.deleteSession(phoneNumber);
//           return "END Order cancelled.";
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not cancel order. Try again.";
//         }
//       }

//       case "POST_PRODUCE": {
//         const { postCrop, postQuantity, postPrice, postLocation } =
//           session.data;
//         if (!postCrop || !postQuantity || !postPrice || !postLocation) {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Something went wrong. Please try again.";
//         }
//         const location =
//           postLocation === "0"
//             ? (session.data.profileLocation ?? session.data.location)
//             : postLocation;
//         if (!location) {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not resolve location. Please try again.";
//         }
//         try {
//           await this.repo.createListing({
//             phoneNumber,
//             crop: postCrop,
//             quantity: parseInt(postQuantity),
//             price: parseInt(postPrice),
//             location,
//             availableFrom: latestInput,
//           });
//           await this.repo.deleteSession(phoneNumber);
//           return `END Listing posted!\n${postCrop}, ${postQuantity}kg @ NGN ${postPrice}/kg`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Failed to post listing. Try again.";
//         }
//       }

//       case "MY_LISTINGS": {
//         try {
//           const listings = await this.repo.getListingsByPhone(phoneNumber);
//           if (!listings.length) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END You have no active listings.";
//           }
//           const lines = listings
//             .slice(0, 3)
//             .map(
//               (l: any, i: number) =>
//                 `${i + 1}. ${l.crop} ${l.quantity}kg @${l.price}/kg`,
//             )
//             .join("\n");
//           session.data.listingIds = listings
//             .slice(0, 3)
//             .map((l: any) => l.id)
//             .join(",");
//           session.step = "listingAction";
//           await this.repo.saveSession(phoneNumber, session);
//           return `CON My Listings:\n${lines}\n\nSelect listing number or 0 to go back`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not fetch listings. Try again.";
//         }
//       }

//       case "MARK_LISTING_SOLD": {
//         try {
//           const listingId = session.data.selectedListingId;
//           if (!listingId) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END Session expired. Please try again.";
//           }
//           await this.repo.updateListingStatus(listingId, "SOLD");
//           await this.repo.deleteSession(phoneNumber);
//           return "END Listing marked as sold successfully.";
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not update listing. Try again.";
//         }
//       }

//       case "CANCEL_LISTING": {
//         try {
//           const listingId = session.data.selectedListingId;
//           if (!listingId) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END Session expired. Please try again.";
//           }
//           await this.repo.updateListingStatus(listingId, "CANCELLED");
//           await this.repo.deleteSession(phoneNumber);
//           return "END Listing cancelled successfully.";
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not cancel listing. Try again.";
//         }
//       }

//       // REPLACES the old BROWSE_PRODUCE case — was read-only, now leads into ordering
//       case "BROWSE_PRODUCE": {
//         try {
//           const listings = await this.repo.getListingsByCrop(
//             latestInput.trim(),
//           );
//           if (!listings.length) {
//             await this.repo.deleteSession(phoneNumber);
//             return `END No listings found for ${latestInput}.`;
//           }
//           const lines = listings
//             .slice(0, 3)
//             .map(
//               (l: any, i: number) =>
//                 `${i + 1}. ${l.crop} ${l.quantity}kg @${l.price}/kg - ${l.location}`,
//             )
//             .join("\n");
//           session.data.browseListingIds = listings
//             .slice(0, 3)
//             .map((l: any) => l.id)
//             .join(",");
//           session.step = "browseSelect";
//           await this.repo.saveSession(phoneNumber, session);
//           return `CON Results:\n${lines}\n\nSelect listing number to order, or 0 to go back`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not fetch listings. Try again.";
//         }
//       }

//       case "PLACE_ORDER": {
//         try {
//           const listingId = session.data.selectedListingId;
//           if (!listingId) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END Session expired. Please try again.";
//           }
//           const result = await this.repo.createOrder({
//             buyerPhone: phoneNumber,
//             listingId,
//             quantity: parseInt(value),
//           });
//           await this.repo.deleteSession(phoneNumber);
//           if (!result.ok) return `END ${result.message}`;
//           return `END Order placed!\n${result.crop} ${value}kg\nTotal: NGN ${result.totalPrice}\nAwaiting farmer confirmation.`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Failed to place order. Try again.";
//         }
//       }

//       case "MY_ORDERS": {
//         try {
//           const orders = await this.repo.getOrdersByBuyerPhone(phoneNumber);
//           if (!orders.length) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END You have no orders yet.";
//           }
//           const lines = orders
//             .slice(0, 3)
//             .map(
//               (o: any, i: number) =>
//                 `${i + 1}. ${o.listing.crop} ${o.quantity}kg - ${o.status}`,
//             )
//             .join("\n");
//           session.data.buyerOrderIds = orders
//             .slice(0, 3)
//             .map((o: any) => o.id)
//             .join(",");
//           session.step = "orderStatusAction";
//           await this.repo.saveSession(phoneNumber, session);
//           return `CON My Orders:\n${lines}\n\nSelect order number or 0 to go back`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not fetch orders. Try again.";
//         }
//       }

//       case "VIEW_ORDER_STATUS": {
//         try {
//           const orderId = session.data.selectedBuyerOrderId;
//           if (!orderId) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END Session expired. Please try again.";
//           }
//           const order = await this.repo.getOrderById(orderId);
//           await this.repo.deleteSession(phoneNumber);
//           if (!order) return "END Order not found.";
//           return `END ${order.listing.crop} ${order.quantity}kg\nStatus: ${order.status}\nTotal: NGN ${order.totalPrice}`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not fetch order. Try again.";
//         }
//       }

//       case "CANCEL_MY_ORDER": {
//         try {
//           const orderId = session.data.selectedBuyerOrderId;
//           if (!orderId) {
//             await this.repo.deleteSession(phoneNumber);
//             return "END Session expired. Please try again.";
//           }
//           const order = await this.repo.getOrderById(orderId);
//           if (!order || order.status !== "PENDING") {
//             await this.repo.deleteSession(phoneNumber);
//             return "END This order can no longer be cancelled.";
//           }
//           await this.repo.updateOrderStatus(orderId, "CANCELLED");
//           await this.repo.deleteSession(phoneNumber);
//           return "END Order cancelled.";
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not cancel order. Try again.";
//         }
//       }

//       case "VIEW_FARMERS": {
//         try {
//           const farmers = await this.repo.getFarmersByAgentPhone(phoneNumber);
//           await this.repo.deleteSession(phoneNumber);
//           if (!farmers.length) return "END You have no farmers added yet.";
//           const lines = farmers
//             .slice(0, 5)
//             .map((f: any, i: number) => `${i + 1}. ${f.name} - ${f.location}`)
//             .join("\n");
//           return `END My Farmers:\n${lines}`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not fetch farmers. Try again.";
//         }
//       }

//       case "AGENT_REPORTS": {
//         try {
//           const r = await this.repo.getAgentReportSummary(phoneNumber);
//           await this.repo.deleteSession(phoneNumber);
//           return `END Agent Report\nFarmers: ${r.farmerCount}\nTransactions: ${r.transactionCount}\nTotal Facilitated: NGN ${r.totalFacilitated}`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not fetch report. Try again.";
//         }
//       }

//       case "ADD_FARMER": {
//         try {
//           const farmer = await this.repo.findUserByPhone(latestInput);
//           if (!farmer || farmer.role !== "FARMER") {
//             await this.repo.deleteSession(phoneNumber);
//             return "END No farmer found with that number.";
//           }
//           await this.repo.linkFarmerToAgent({
//             agentPhone: phoneNumber,
//             farmerPhone: latestInput,
//           });
//           await this.repo.deleteSession(phoneNumber);
//           return `END Farmer ${farmer.name} added successfully.`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Failed to add farmer. Try again.";
//         }
//       }

//       case "FACILITATE_TRANSACTION": {
//         const pinValid = await this.repo.verifyPin(phoneNumber, latestInput);
//         if (!pinValid) {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Incorrect PIN. Transaction cancelled.";
//         }
//         const { facilitatePhone, facilitateBuyerPhone, facilitateAmount } =
//           session.data;
//         if (!facilitatePhone || !facilitateBuyerPhone || !facilitateAmount) {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Session data missing. Please try again.";
//         }
//         try {
//           await this.repo.createTransaction({
//             agentPhone: phoneNumber,
//             farmerPhone: facilitatePhone,
//             buyerPhone: facilitateBuyerPhone,
//             amount: parseInt(facilitateAmount),
//           });
//           await this.repo.deleteSession(phoneNumber);
//           return `END Transaction of NGN ${facilitateAmount} facilitated successfully.`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Transaction failed. Try again.";
//         }
//       }

//       case "EARNINGS": {
//         try {
//           const earnings = await this.repo.getEarnings(phoneNumber);
//           await this.repo.deleteSession(phoneNumber);
//           return `END Total: NGN ${earnings.total}\nPending: NGN ${earnings.pending}\nPaid Out: NGN ${earnings.paidOut}`;
//         } catch {
//           await this.repo.deleteSession(phoneNumber);
//           return "END Could not fetch earnings. Try again.";
//         }
//       }

//       default:
//         await this.repo.deleteSession(phoneNumber);
//         return "END Something went wrong. Please try again.";
//     }
//   }
// }
