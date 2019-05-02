export function dateFormat(d){
  var date = d == null?new Date():new Date(d);
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  if(month<10){
    month = '0' + month;
  }
  if(day<10){
    day = '0' + day;
  }
  return year+'-'+month+'-'+day;
}
