function attackerMixIN<T extends new (...args:any[]) => any;>( base:T){
    return class extends base{
        attack= 5
    }
}
function terranMixIn<T extends new (...args:any[]) => any;>( base:T){
    return class extends base{
        type='human'
    }
}

class Unit{
    name
    speed
    shield
    constructor( name,  speed,  shield){
        name = name
        speed= speed
        shield=shield
    }
}

const MyClass = terranMixIn( attackerMixIN( Unit ) )
const marine = new MyClass('marine', 10, 7)
console.log(marine)