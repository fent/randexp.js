import * as DRange from "drange";

declare namespace RandExp {
    function randexp(pattern: string | RegExp, flags?: string): string;
    function sugar(): void;
    var prototype: {
        new(pattern: string | RegExp, flags?: string): RandExp;
        randexp(pattern: string | RegExp, flags?: string): string;
        sugar(): void;
        gen(): string;
        defaultRange: DRange;
        randInt: (from: number, to: number) => number;
        max: number;
    };
}

declare class RandExp {
    static randexp(pattern: string | RegExp, flags?: string): string;
    static sugar(): void;
    constructor(pattern: string | RegExp, flags?: string);
    gen(): string;
    defaultRange: DRange;
    randInt: (from: number, to: number) => number;
    max: number;
}

export = RandExp;
