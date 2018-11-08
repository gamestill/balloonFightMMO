var enumProp = ["STRING_COLL","QT_COLL"];


function createEnumProp(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: false
    });
}

for(var i=0;i<enumProp.length;i++){
    createEnumProp(enumProp[i], i);  
  
}

if(!enumProp || enumProp.length===0){
    console.log('collision enum:error');
}