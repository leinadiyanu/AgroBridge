import { UserService } from "./service.js";
export class UserController {
    constructor() {
        this.service = new UserService();
        // ── Own profile ───────────────────────────────────────────────────────────
        this.getMe = async (req, res, next) => {
            try {
                const user = await this.service.getMe(req.userId);
                res.status(200).json({ success: true, data: { user } });
            }
            catch (err) {
                next(err);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                const { name, location, email, farmSize, deliveryAddress, coverageArea } = req.body;
                const user = await this.service.updateProfile(req.userId, {
                    name,
                    location,
                    email,
                    farmSize,
                    deliveryAddress,
                    coverageArea,
                });
                res
                    .status(200)
                    .json({ success: true, message: "Profile updated", data: { user } });
            }
            catch (err) {
                next(err);
            }
        };
        // ── Password ──────────────────────────────────────────────────────────────
        this.changePassword = async (req, res, next) => {
            try {
                const { oldPassword, newPassword } = req.body;
                await this.service.changePassword(req.userId, {
                    oldPassword,
                    newPassword,
                });
                res
                    .status(200)
                    .json({ success: true, message: "Password changed successfully" });
            }
            catch (err) {
                next(err);
            }
        };
        // ── Phone change ──────────────────────────────────────────────────────────
        this.initiatePhoneChange = async (req, res, next) => {
            try {
                const { newPhone } = req.body;
                const result = await this.service.initiatePhoneChange(req.userId, newPhone);
                res.status(200).json({ success: true, ...result });
            }
            catch (err) {
                next(err);
            }
        };
        this.verifyPhoneChange = async (req, res, next) => {
            try {
                const { otp } = req.body;
                const result = await this.service.verifyPhoneChange(req.userId, otp);
                res.status(200).json({
                    success: true,
                    message: "Phone number updated successfully",
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        };
        // ── Public profile ────────────────────────────────────────────────────────
        this.getPublicProfile = async (req, res, next) => {
            try {
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({ success: false, message: "User ID is required" });
                    return;
                }
                const user = await this.service.getPublicProfile(id);
                res.status(200).json({ success: true, data: { user } });
            }
            catch (err) {
                next(err);
            }
        };
        // ── Lists ─────────────────────────────────────────────────────────────────
        this.listFarmers = async (req, res, next) => {
            try {
                const page = Math.max(1, parseInt(req.query.page) || 1);
                const limit = Math.min(50, parseInt(req.query.limit) || 20);
                const result = await this.service.listFarmers(page, limit);
                res.status(200).json({ success: true, data: result });
            }
            catch (err) {
                next(err);
            }
        };
        this.listAgents = async (req, res, next) => {
            try {
                const page = Math.max(1, parseInt(req.query.page) || 1);
                const limit = Math.min(50, parseInt(req.query.limit) || 20);
                const result = await this.service.listAgents(page, limit);
                res.status(200).json({ success: true, data: result });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
//# sourceMappingURL=controller.js.map