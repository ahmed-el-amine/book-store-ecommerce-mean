import Order from "../database/models/order.model.js";

export const addNewOrder = async (req) => {
    try {
        const {
            items,
            totalPrice,
            shippingAddress,
            estimatedDeliveryDate,
            notes,
            discountApplied,
            taxAmount,
            paymentMethod,
            status,
        } = req.body;

        const userId = req.userId;

        const order = await Order.create({
            userId,
            items,
            totalPrice,
            shippingAddress,
            estimatedDeliveryDate,
            notes,
            discountApplied,
            taxAmount,
            paymentMethod,
            status,
        });

        return {
            success: true,
            message: "Order placed successfully",
            data: order,
        };
    } catch (err) {
        throw new Error("Error while placing order: " + err.message);
    }
};
export const getOrders = async (req) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ userId });
        return orders;
    } catch (err) {
        throw new Error("Error while getting orders: " + err.message);
    }
};
