import { Sequelize } from "sequelize-typescript";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequilize/customer.model";
import CustomerRepository from "../../../customer/repository/sequilize/customer.repository";
import ProductModel from "../../../product/repository/sequilize/product.model";
import ProductRepository from "../../../product/repository/sequilize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an existing order", async () => {
    // Arrange: Criação de dados iniciais
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
  
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);
  
    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
  
    const updatedProduct = new Product("123", "Updated Product", 20);
    await productRepository.update(updatedProduct);
  
    const updatedOrderItem = new OrderItem("1", updatedProduct.name, updatedProduct.price, updatedProduct.id, 3);
    const updatedOrder = new Order("123", "123", [updatedOrderItem]);
    await orderRepository.update(updatedOrder);
  
    const updatedOrderModel = await OrderModel.findOne({
      where: { id: updatedOrder.id },
      include: [{ model: OrderItemModel }],
    });
  
    expect(updatedOrderModel).toBeTruthy();
  
    const orderJson = updatedOrderModel?.toJSON();
    expect(orderJson).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: updatedOrder.total(),
      items: [
        {
          id: "1",
          name: "Updated Product",
          price: 20,
          quantity: 3,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });  

  it("should find an order by id", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find("123");

    expect(foundOrder).toBeTruthy();
    expect(foundOrder?.id).toBe("123");
    expect(foundOrder?.customerId).toBe("123");
    expect(foundOrder?.items.length).toBe(1);
    expect(foundOrder?.items[0]).toEqual(orderItem);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.Address = address;
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("123", "Product 1", 10);
    await productRepository.create(product1);

    const product2 = new Product("456", "Product 2", 20);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
    const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 3);

    const order1 = new Order("123", "123", [orderItem1]);
    const order2 = new Order("456", "123", [orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const allOrders = await orderRepository.findAll();

    expect(allOrders).toHaveLength(2);
    expect(allOrders[0]).toMatchObject({
      id: "123",
      customerId: "123",
      items: [orderItem1],
    });
    expect(allOrders[1]).toMatchObject({
      id: "456",
      customerId: "123",
      items: [orderItem2],
    });
  });
});