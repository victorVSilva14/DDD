import Address from "../../customer/value-object/address";
import Customer from "../../customer/entity/customer";
import CustomerChangedAddressEvent from "../../customer/event/customer-changed-address.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendConsoleLogWhenCustomerAddressChangedHandler from "../../customer/event/handler/send-console-log-when-customer-address-changed.handler";
import SendFirstConsoleLogWhenCustomerIsCreatedHandler from "../../customer/event/handler/send-first-console-log-when-customer-is-created.handler";
import SendSecondConsoleLogWhenCustomerIsCreatedHandler from "../../customer/event/handler/send-second-console-log-when-customer-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events test", () => {
    it("Should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
            1
        );
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("Should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"].length
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"].length
        ).toBe(0);
    });

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
        ).toMatchObject(eventHandler);
    
        eventDispatcher.unregisterAll();
    
        expect(
          eventDispatcher.getEventHandlers["ProductCreatedEvent"]
        ).toBeUndefined();
    });

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        // verifica se o eventHandler executou o handle
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
        ).toMatchObject(eventHandler);
    
        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0
        });

        // Quando o notify for executado, o sendEmailWhenProductCreateHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("Should send consoleLog1 handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendFirstConsoleLogWhenCustomerIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);
    
        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "123",
            name: "Customer 1"
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("Should send consoleLog2 handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendSecondConsoleLogWhenCustomerIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);
    
        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "124",
            name: "Customer 2"
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("Should send consoleLog when change address customer", () => {
        const customer1 = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.Address = address;

        const changedAddress = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer1.changeAddress(changedAddress);

        const customerChangedAddressEvent = new CustomerChangedAddressEvent(customer1);
        
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogWhenCustomerAddressChangedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
        ).toMatchObject(eventHandler);
    
        eventDispatcher.notify(customerChangedAddressEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});