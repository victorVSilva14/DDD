// Essa classe é uma entidade
// em DDD, os dados ja devem chegar aqui consistidos, ou seja, todos os campos obrigatórios devem vir preenchidos
// uma entidade sempre terá que se autovalidar em DDD para evitar que ela fique inconsistente, por isso é necessário as validações
/* 
    A entidade é focada em negócios e não em persistencia, ou seja, o id identifica o customer no programa e nao no BD, 
    por conta de que o DDD não é ORM (Orientado a banco de dados).
    A entidade focada em persistencia estará dentro do bloco de infraestrutura, ela pode ter getters e setters e será focada na persistencia
    
    Complexidade de negócio
    Domain
        - Entity
            -- Customer.ts (regra de negocio)
    
    Complexidade acidental 
    Infra - mundo externo
        - Entity / model
            -- customer.ts (get, set)
*/ 
/* 
    Por esse motivo, uma entidade geralmente nao tem getters e setters, pois pode ferir uma validação, por exemplo, a api é de conta bancaria
    e voce coloca um setSaldo, geralmente teria um metodo chamado depositar
*/

import Address from "../value-object/address";


export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  /*
    Esse set não terá problema em tê-lo, pois o objeto terá que ser do tipo Address, ou seja,
    terá que obedecer a regra de negócio do valueObject Address
  */ 
  set Address(address: Address) {
    this._address = address;
  }
}