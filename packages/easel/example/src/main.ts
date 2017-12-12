import Easel from '../../src';
import '../../src/style.scss';

const easel = new Easel(document.getElementById('easel') as HTMLElement, {
    width: 1000,
    height: 1000
});
console.log(easel);