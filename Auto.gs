function auto() {
  const Row = 8;
  const Id = 1;
  const Current_Price = 5;
  const Manual_Break = "A5";
  const Difference = 6;
  const Top_Coins = "A6";
  const Status = "A7";
  let coinList = [];
  
  let spread = SpreadsheetApp.getActiveSheet();
  const getTop_Coins = spread.getRange(Top_Coins).getValue();
  spread.getRange(Status).setBackground("orange");
  try{
    if(spread.getRange(Manual_Break).getValue() == ''){
      let response = UrlFetchApp.fetch("https://api.coingecko.com/api/v3/coins/list");
      let condensed = response.getContentText();
      let data = JSON.parse(condensed);
      function getPrint(p_Page, page, c_Line, Row, Current_Price, list, coinList, difference){
        let last_response = UrlFetchApp.fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids="+ list +"&order=market_cap_desc&per_page=250&page=1&sparkline=false");
        let last_condensed = last_response.getContentText();
        let last_data = JSON.parse(last_condensed);
        for(x = 0; x< p_Page; x++){
          for (a = 0; a <= last_data.length-1; a++){
            var filtered = last_data.find(function(item, i){
              if (item.id == coinList[x+c_Line]){
                filteredIndex = i;
                return i;
              } 
            });
          }
          if(last_data[filteredIndex]["current_price"] != null){
            spread.getRange(c_Line+Row+x, Current_Price).setValue(last_data[filteredIndex]["current_price"]);
          }else{
           spread.getRange(c_Line+Row+x, Current_Price).setValue("1"); 
          }
          spread.getRange(c_Line+Row+x, difference).setValue("=TO_PERCENT(E"+ (c_Line+Row+x) +"/D"+ (c_Line+Row+x) +")-1");
          
        }
      }
      for(let x = 0; x < getTop_Coins; x++){
        coinList.push(spread.getRange(x+Row, Id).getValue());
      }
      let c_Line = 0;
      let pages = Math.ceil(coinList.length/50);
      for(let v = 1; v<=pages; v++){
        let list = coinList[c_Line];
        list += ","+coinList.slice((c_Line+1), (c_Line+50))
        if(v == pages){
          let c_Page = getTop_Coins - (50 * (pages - 1));
          getPrint(c_Page, v, c_Line, Row, Current_Price, list, coinList, Difference);
        }else{
          getPrint(50, v, c_Line, Row, Current_Price, list, coinList, Difference);
          c_Line += 50;
        }
      }
    }
  }
  catch(err){
    Logger.log(err);
  }
  finally{
   spread.getRange(Status).setBackground("green");
  }
}
