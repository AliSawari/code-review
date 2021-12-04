export default function shouldHave(body, selections){
  let results:any = {};
  let notFounds:any[] = [];
  for(let select of selections){
    if(body[select] && body[select] != null && body[select] !== ''){
      results[select] = body[select];
    } else notFounds.push(select);
  }

  return {
    results,
    notFounds
  }
}

