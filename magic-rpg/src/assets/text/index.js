export default function lookup(array, index) {
  return array[index % array.length];
}
