export default function trueColor(colorString: any): {
    r: number;
    g: number;
    b: number;
    a?: undefined;
} | {
    r: number;
    g: number;
    b: number;
    a: number;
} | undefined;
