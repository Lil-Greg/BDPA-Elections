export default function getImageURL(name: string) {
    return new URL(`../assets/${name}`, import.meta.url).href
}