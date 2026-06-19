export const templates = {
  orderPlaced: (crop: string, quantity: number, buyerName: string) => ({
    sms: `AgroBridge: New order! ${buyerName} wants ${quantity}kg of ${crop}. Login to confirm.`,
    email: {
      subject: `New Order for your ${crop} listing`,
      html: `
        <h2>You have a new order!</h2>
        <p><b>${buyerName}</b> has placed an order for <b>${quantity}kg of ${crop}</b>.</p>
        <p>Login to your AgroBridge account to confirm or decline.</p>
      `,
    },
  }),

  orderConfirmed: (crop: string, quantity: number, farmerName: string) => ({
    sms: `AgroBridge: Your order for ${quantity}kg of ${crop} has been confirmed by ${farmerName}.`,
    email: {
      subject: `Order Confirmed — ${crop}`,
      html: `
        <h2>Order Confirmed!</h2>
        <p><b>${farmerName}</b> has confirmed your order for <b>${quantity}kg of ${crop}</b>.</p>
        <p>Payment will be held in escrow until you confirm delivery.</p>
      `,
    },
  }),

  orderCancelled: (crop: string, cancelledBy: string) => ({
    sms: `AgroBridge: Your order for ${crop} was cancelled by ${cancelledBy}.`,
    email: {
      subject: `Order Cancelled — ${crop}`,
      html: `
        <h2>Order Cancelled</h2>
        <p>Your order for <b>${crop}</b> was cancelled by <b>${cancelledBy}</b>.</p>
      `,
    },
  }),

  orderCompleted: (crop: string, amount: number) => ({
    sms: `AgroBridge: Order for ${crop} completed! NGN ${amount} is being released to your account.`,
    email: {
      subject: `Payment Released — ${crop}`,
      html: `
        <h2>Payment Released!</h2>
        <p>Your order for <b>${crop}</b> has been marked as delivered.</p>
        <p><b>NGN ${amount.toLocaleString()}</b> is being released from escrow to your account.</p>
      `,
    },
  }),

  paymentReceived: (crop: string, amount: number) => ({
    sms: `AgroBridge: NGN ${amount} received for ${crop}. Check your account.`,
    email: {
      subject: `Payment Received — ${crop}`,
      html: `
        <h2>Payment Received!</h2>
        <p>You have received <b>NGN ${amount.toLocaleString()}</b> for your <b>${crop}</b> listing.</p>
      `,
    },
  }),

  priceAlert: (crop: string, direction: string, advice: string) => ({
    sms: `AgroBridge Price Alert: ${crop} trend is ${direction}. ${advice}`,
    email: {
      subject: `Weekly Price Alert — ${crop}`,
      html: `
      <h2>Weekly Price Intelligence</h2>
      <p>Here's this week's price trend for your <b>${crop}</b> listing:</p>
      <p><b>Trend:</b> ${direction}</p>
      <p><b>Advice:</b> ${advice}</p>
      <p>Login to AgroBridge to view full details.</p>
    `,
    },
  }),

  welcomeMessage: (name: string) => ({
    sms: `Welcome to AgroBridge ${name}! Buy and sell farm produce easily. Dial *384*123# to get started.`,
    email: {
      subject: "Welcome to AgroBridge!",
      html: `
      <h2>Welcome, ${name}!</h2>
      <p>You're now part of AgroBridge — Nigeria's agricultural marketplace.</p>
      <p>Start by browsing listings or posting your produce.</p>
    `,
    },
  }),

  listingExpiringSoon: (crop: string, daysLeft: number) => ({
    sms: `AgroBridge: Your ${crop} listing expires in ${daysLeft} day(s). Login to renew it.`,
    email: {
      subject: `Your ${crop} listing is expiring soon`,
      html: `
      <h2>Listing Expiring Soon</h2>
      <p>Your <b>${crop}</b> listing expires in <b>${daysLeft} day(s)</b>.</p>
      <p>Login to renew or update your listing.</p>
    `,
    },
  }),

  listingSold: (crop: string, quantity: number) => ({
    sms: `AgroBridge: Your ${crop} listing (${quantity}kg) has been marked as sold. Well done!`,
    email: {
      subject: `Listing Sold — ${crop}`,
      html: `
      <h2>Listing Sold!</h2>
      <p>Your <b>${crop}</b> listing of <b>${quantity}kg</b> has been marked as sold.</p>
      <p>Login to post a new listing.</p>
    `,
    },
  }),

  listingFirstOrder: (crop: string, buyerName: string) => ({
    sms: `AgroBridge: ${buyerName} just placed the first order on your ${crop} listing!`,
    email: {
      subject: `First Order on your ${crop} listing!`,
      html: `
      <h2>You got your first order!</h2>
      <p><b>${buyerName}</b> just placed an order on your <b>${crop}</b> listing.</p>
      <p>Login to confirm the order.</p>
    `,
    },
  }),

  webActivated: (name: string) => ({
    sms: `AgroBridge: Web access activated for your account ${name}. You can now login at our website.`,
    email: {
      subject: "Web Access Activated",
      html: `
      <h2>Web Access Activated!</h2>
      <p>Hi <b>${name}</b>, your AgroBridge web account is now active.</p>
      <p>You can now login via the web app in addition to USSD.</p>
    `,
    },
  }),

  passwordChanged: (name: string) => ({
    sms: `AgroBridge: Your password was just changed. If this wasn't you, call us immediately.`,
    email: {
      subject: "Password Changed — Security Alert",
      html: `
      <h2>Password Changed</h2>
      <p>Hi <b>${name}</b>, your AgroBridge password was just changed.</p>
      <p>If you did not do this, please contact us immediately.</p>
    `,
    },
  }),

  paymentInitiated: (crop: string, amount: number) => ({
    sms: `AgroBridge: Payment of NGN ${amount} initiated for ${crop}. Funds held in escrow pending delivery.`,
    email: {
      subject: `Payment Initiated — ${crop}`,
      html: `
      <h2>Payment Initiated</h2>
      <p>Your payment of <b>NGN ${amount.toLocaleString()}</b> for <b>${crop}</b> has been received.</p>
      <p>Funds are held securely in escrow until you confirm delivery.</p>
    `,
    },
  }),

  escrowHolding: (crop: string, amount: number) => ({
    sms: `AgroBridge: NGN ${amount} is held in escrow for your ${crop} order. Funds release on delivery confirmation.`,
    email: {
      subject: `Funds in Escrow — ${crop}`,
      html: `
      <h2>Funds Held in Escrow</h2>
      <p><b>NGN ${amount.toLocaleString()}</b> is securely held in escrow for your <b>${crop}</b> transaction.</p>
      <p>Funds will be released to the farmer once you confirm delivery.</p>
    `,
    },
  }),

  disputeRaised: (crop: string, orderId: string) => ({
    sms: `AgroBridge: A dispute has been raised on your ${crop} order (${orderId.slice(0, 8)}). We will review and respond shortly.`,
    email: {
      subject: `Dispute Raised — ${crop}`,
      html: `
      <h2>Dispute Raised</h2>
      <p>A dispute has been raised on the <b>${crop}</b> order.</p>
      <p>Order reference: <b>${orderId}</b></p>
      <p>Our team will review and respond within 24 hours.</p>
    `,
    },
  }),

  farmerAssigned: (farmerName: string, agentName: string) => ({
    sms: `AgroBridge: You have been assigned to agent ${agentName}. They will help you with transactions.`,
    email: {
      subject: "Agent Assigned to Your Account",
      html: `
      <h2>Agent Assigned</h2>
      <p>Hi <b>${farmerName}</b>, you have been assigned to agent <b>${agentName}</b>.</p>
      <p>Your agent will help facilitate your transactions on AgroBridge.</p>
    `,
    },
  }),

  agentFarmerAdded: (farmerName: string) => ({
    sms: `AgroBridge: Farmer ${farmerName} has been added to your managed list.`,
    email: {
      subject: `New Farmer Added — ${farmerName}`,
      html: `
      <h2>Farmer Added</h2>
      <p><b>${farmerName}</b> has been added to your list of managed farmers.</p>
    `,
    },
  }),

  transactionFacilitated: (crop: string, amount: number) => ({
    sms: `AgroBridge: A transaction of NGN ${amount} for ${crop} has been facilitated by your agent.`,
    email: {
      subject: `Transaction Facilitated — ${crop}`,
      html: `
      <h2>Transaction Facilitated</h2>
      <p>Your agent has facilitated a transaction of <b>NGN ${amount.toLocaleString()}</b> for <b>${crop}</b>.</p>
    `,
    },
  }),
};
