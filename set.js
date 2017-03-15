var a = [2,2,2,2,3];
var b = [2,2,3,3,5];

var hista = {};
var histb = {};

function createHistogram(k,dict){
  k.forEach(function(b){
    if (b in dict){
      dict[b]++;
    }
    else {
      dict[b] = 1;
    }
  });
  return dict;
}

createHistogram(a,hista);
createHistogram(b,histb);

if(Object.keys(histb).length > Object.keys(hista).length){
  for(var i=0;i<Object.keys(histb).length-1;i++){
    
  }
}
