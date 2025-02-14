// Essa classe é um valueObject
// um valueObject tem que se autovalidar, é imutavel e não possui ID 
// A unica forma de mudar o objeto de valor, é criando outro, pois não possui getters e setters, apenas o construtor
/* 
    O grande ponto é que consigo visualizar/manipular o objeto de qualquer forma, mas não consigo auterá-lo, 
    ele não é unico, pois sua ideia é apenas carregar propriedades. Consigo por exemplo carregar um CPF com máscara ou sem.
*/ 
export default class Address {
    private _street: string = "";
    private _number: number = 0;
    private _zip: string = "";
    private _city: string = "";

    constructor(street: string, number: number, zip: string, city: string) {
        this._street = street;
        this._number = number;
        this._zip = zip;
        this._city = city;

        this.validate();
    }

    get street(): string {
        return this._street;
    }

    get number(): number {
        return this._number;
    }

    get zip(): string {
        return this._zip;
    }

    get city(): string {
        return this._city;
    }

    validate() {
        if (this._street.length === 0) {
            throw new Error("Street is required!");
        }
        if (this._number === 0) {
            throw new Error("Number is required!");
        }
        if (this._zip.length === 0) {
            throw new Error("Zip is required!");
        }
        if (this._city.length === 0) {
            throw new Error("City is required!");
        }
    }

    toString() {
        return `${this._street}, ${this._number}, ${this._zip}, ${this._city}`;
    }
}