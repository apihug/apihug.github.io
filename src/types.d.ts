declare module "*.png" {
  const content: { src: string; width: number; height: number; blurDataURL?: string };
  export default content;
}

declare module "*.jpg" {
  const content: { src: string; width: number; height: number; blurDataURL?: string };
  export default content;
}

declare module "*.svg" {
  const content: { src: string; width: number; height: number };
  export default content;
}

declare module "*.react.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
