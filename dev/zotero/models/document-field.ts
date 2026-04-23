export default class DocumentField {
    private id: number;
    private code: string = '';
    private text: string;

    constructor(id: number) {
        this.id = id;
    }

    getId(): number {
        return this.id;
    }

    setText(value: string): void {
        this.text = value;
    }

    getText(): string {
        return this.text;
    }

    setCode(value: string) {
        this.code = value;
    }

    getCode(): string {
        return this.code;
    }
}