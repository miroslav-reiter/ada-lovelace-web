// Pure simulation rules shared by the browser and automated checks.
export const commands = Object.freeze({
  math: ['set', 'add', 'multiply', 'show'],
  tea: ['water', 'heat', 'leaves', 'steep', 'pour']
});
export function initialMachine() {
  return {memory:0, stage:0, index:0, status:'idle', message:'ready', values:[], trace:[]};
}
export function stepMachine(previous, mission, program) {
  if (previous.status==='success'||previous.status==='error') return previous;
  const state={...previous,values:[],trace:[...previous.trace]};
  const fail=(message,values=[])=>{
    state.status='error';state.message=message;state.values=values;
    state.trace.push({step:state.index+1,message,values,error:true});
    return state;
  };
  if(!program.length) return fail('needCards');
  if(program.length>12) return fail('full');
  const action=program[state.index];
  if(!commands[mission]?.includes(action))return fail('errorUnknown');
  if((action==='show'||action==='pour')&&state.index!==program.length-1)return fail('errorLast');
  let message,values=[];
  if(mission==='math') {
    if(action==='set'){state.memory=2;message='didSet';}
    if(action==='add'){state.memory+=3;message='didAdd';values=[state.memory];}
    if(action==='multiply'){state.memory*=2;message='didMultiply';values=[state.memory];}
    if(!Number.isSafeInteger(state.memory)||Math.abs(state.memory)>1e9)return fail('errorOverflow');
    if(action==='show'){
      if(state.memory!==10)return fail('errorGoal',[state.memory]);
      message='successMath';state.status='success';
    }
  } else {
    const required=commands.tea.indexOf(action);
    if(state.stage>required)return fail('errorRepeat');
    if(state.stage<required)return fail(['errorRepeat','errorEmpty','errorCold','errorLeaves','errorSteep'][required]);
    state.stage=required+1;
    message=['didWater','didHeat','didLeaves','didSteep','successTea'][required];
    if(action==='pour')state.status='success';
  }
  state.index++;
  state.message=message;state.values=values;
  state.trace.push({step:state.index,message,values,error:false});
  if(state.status!=='success'){
    state.status='ready';
    if(state.index===program.length){
      state.status='error';state.message='errorOutput';state.values=[];
      state.trace.push({step:state.index,message:'errorOutput',values:[],error:true});
    }
  }
  return state;
}
export function runMachine(mission,program) {
  let state=initialMachine();
  do { state=stepMachine(state,mission,program); } while(state.status!=='success'&&state.status!=='error');
  return state;
}
export function diplomaRank(correct,total) {
  if(!Number.isInteger(correct)||!Number.isInteger(total)||total<1||correct<0||correct>total)throw new RangeError('Invalid quiz result');
  return correct/total>=10/12?'rankHigh':correct/total>=.5?'rankMid':'rankLow';
}
