import Easel from '../../src';
import '../../src/style.scss';

const easel = new Easel(document.getElementById('easel') as HTMLElement, {
    width: 2560,
    height: 1440
});
console.log(easel);