// Lembrar que é 1 repositório por agregado, por isso nao existe orderItemRepository

import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: { id: entity.id },
      }
    );

    const existingItems = await OrderItemModel.findAll({
      where: { order_id: entity.id },
    });

    const existingItemsMap = new Map(existingItems.map(item => [item.id, item]));

    for (const item of entity.items) {
      if (existingItemsMap.has(item.id)) {
        await OrderItemModel.update({
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        }, {
          where: { id: item.id },
        });
        existingItemsMap.delete(item.id);
      }
    }

    for (const [id, item] of existingItemsMap) {
      await OrderItemModel.destroy({
        where: { id: id },
      });
    }
  }

  async find(id: string): Promise<Order | null> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }],
    });

    if (!orderModel) return null;

    const items = orderModel.items.map(item => new OrderItem(
      item.id,
      item.name,
      item.price,
      item.product_id,
      item.quantity
    ));

    return new Order(
      orderModel.id,
      orderModel.customer_id,
      items
    );
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    // Converte os modelos para entidades
    return orders.map(orderModel => {
      const items = orderModel.items.map(item => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      ));

      return new Order(
        orderModel.id,
        orderModel.customer_id,
        items
      );
    });
  }
}