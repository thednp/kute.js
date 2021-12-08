import transformProperty from './transformProperty';

/** check if transform is supported via prefixed property */
const supportTransform = transformProperty in document.head.style;
export default supportTransform;
