function myFunction() {
  const Row = 8;
  const Id = 1;
  const Coin = 2;
  const Top_Coins = "A6";
  const Starting_Price = 4;
  const Status = "A7";
  
  let spread = SpreadsheetApp.getActiveSheet();
  spread.getRange(Status).setBackground("orange");
  try{
    
    let getTopCoins = spread.getRange(Top_Coins).getValue();
    let pages = Math.ceil(getTopCoins/250);
    function getPrint(p_Page, page, c_Line, Row, Coin, s_Price, Id){
      let response = UrlFetchApp.fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page="+ page +"&sparkline=false");
      let condensed = response.getContentText();
      let data = JSON.parse(condensed);
      for(x = 0; x< p_Page; x++){
        spread.getRange(c_Line+Row+x, Coin).setValue(data[x]["symbol"]);
        if(data[x]["current_price"] != null){
          spread.getRange(c_Line+Row+x, s_Price).setValue(data[x]["current_price"]);
        }else{
          spread.getRange(c_Line+Row+x, s_Price).setValue("1");
        }
        spread.getRange(c_Line+Row+x, Id).setValue(data[x]["id"]);
      }
    }
    let c_Line = 0; 
    for(let i = 1; i<=pages; i++){
      if(i == pages){
        let c_Page = getTopCoins - (250 * (pages - 1));
        getPrint(c_Page, i, c_Line, Row, Coin, Starting_Price, Id);
      }else{
        getPrint(250, i, c_Line, Row, Coin, Starting_Price, Id);
        c_Line += 250;
      }
    }
    Logger.log(pages);
  }
  catch(err){
    Logger.log(err);
  }
  finally{
    spread.getRange(Status).setBackground("green");
  }
}
