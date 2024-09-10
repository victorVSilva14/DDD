import {
    Table,
    Model,
    PrimaryKey,
    Column,
    ForeignKey,
    BelongsTo
  } from "sequelize-typescript";
import ProductModel from "../../../product/repository/sequilize/product.model";
import OrderModel from "./order.model";

  @Table({
    tableName: "order_items",
    timestamps: false,
  })
  export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;
  
    // recupera apenas o ID e cria a chave estrangeira
    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare product_id: string;
    
    // Recupera todo o customer
    @BelongsTo(() => ProductModel)
    declare product: ProductModel;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare order_id: string;

    @BelongsTo(() => OrderModel)
    declare order: OrderModel;

    @Column({ allowNull: false })
    declare quantity: number;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;
  
}