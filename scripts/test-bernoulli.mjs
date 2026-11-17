import assert from 'node:assert/strict';
import {bernoulli,format,fraction,trace} from '../dist/bernoulli-core.mjs';
// Reference values, including zeros and a non-unit numerator, catch sign/index errors.
assert.deepEqual(bernoulli(12).map(format),['1','-1/2','1/6','0','-1/30','0','1/42','0','-1/30','0','5/66','0','-691/2730']);
assert.equal(format(fraction(6,-8)),'-3/4');
assert.equal(format(fraction(0,8)),'0');
assert.throws(()=>fraction(1,0),RangeError);
assert.throws(()=>bernoulli(2.5),RangeError);
assert.throws(()=>trace(3),RangeError);
const b2=trace(2);
assert.deepEqual(b2.known,['1','-1/2']);
assert.deepEqual(b2.steps.map(s=>s.sum),['0','1','-1/2','-1/2']);
for(const [n,result] of [[2,'1/6'],[4,'-1/30'],[6,'1/42'],[8,'-1/30']]) {
 const run=trace(n);
 assert.equal(run.steps.at(-1).result,result);
 assert.equal(run.steps.length,n+2);
 assert.equal(run.steps.filter(s=>s.kind==='add').length,n);
}
console.log('PASS: exact Bernoulli values B0 through B12, historical target B8, trace sums, signs and invalid input.');
