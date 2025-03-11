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
        const userId = "607d1b2f5b3c2a0f88d1f7a9";
         const filter = { userId };
        const { status } = req.query;  // استخراج status من query parameters

        if (status) {
            filter.status = status;
            const orders = await Order.find(filter);
            return orders;
        }
        const orders = await Order.find({ userId });
        return orders;
    } catch (err) {
        throw new Error("Error while getting orders: " + err.message);
    }
};
