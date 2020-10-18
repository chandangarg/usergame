import React from 'react';  
//import Fireworks from 'react-native-fireworks';
//import fx from 'fireworks';
import { Fireworks } from 'fireworks/lib/react';


const fxProps = {
    count: 1,
    interval: 2000,
    bubbleSizeMinimum: 10,
    bubbleSizeMaximum: 50,
    //colors: ['#cc3333', '#4CAF50', '#81C784', 'chocolate', 'blue', 'pink'],
    colors: ['indigo', 'blue', 'yellow', 'green', 'violet', 'orange', 'chocolate', 'pink', 'brown'],
    calc: (props, i) => ({
      ...props,
      x: (i+0.50) * (window.innerWidth / 3) - (i + 1) * 100,
      y:  -180 + Math.random() * 100 - 50 + (i === 2 ? -80 : 0)
    })
}


class GameElements extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          UserSelectedData : [],
          ComputerSelectedData : [],
          WinnerVerticalArray: [],
          WinnerHorizontalArray: [],
          availableSlots : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
          TotalPlay: 0,
          Winner: '',
          ShowWinnerDiv : 'hide',
          DifficultLevel : 'easy'
      };
    }

    componentDidMount(){
        let Level = localStorage.getItem('Level');
        if( Level ){
            this.setState({DifficultLevel: Level});
        }
        //horizontal winner array
        //vertical winner array
        let winnerArray = [];
        let horizontalwinnerarray = [];
        var count = 1;
        for(let i = 1; i <= 5; i++)
        {
            let temparr = [];
            let horizontalarr = [];
            for(let j=i; j < (4+i); j++){
                var v = ( j*5 ) - (i*5) + i;
                temparr.push(v);
                horizontalarr.push( count );
                count++;
            }
            horizontalarr.push( count );
            count++;

            winnerArray.push( temparr );
            horizontalwinnerarray.push( horizontalarr );
            this.setState({WinnerVerticalArray: winnerArray});
            this.setState({WinnerHorizontalArray: horizontalwinnerarray});
        }
    }

    getIndex = (value, arr) => {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === value) {
                return i;
            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    checkSelection = (event) => {
        let selectedData = this.state.UserSelectedData;
        let availableSlots = this.state.availableSlots;
        let totalClick = this.state.TotalPlay;
        let checkWinner = this.state.Winner;
        if( checkWinner !== '' ){
            return;
        }
        let id = event.target.dataset.id;
        //console.log('asd' );
        event.target.classList.add('user');
       
        
        if( selectedData.indexOf(id) === -1 && checkWinner === ''){
            
            //remove the user selected data from available slot
            var index = this.getIndex( parseInt(id) , availableSlots );
            //console.log(index);
            
            if (index !== -1) {

                //set user selected data in array
                selectedData.push( parseInt( event.target.dataset.id) );
                this.setState({ UserSelectedData: selectedData});
                
                totalClick++;
                this.setState({TotalPlay: totalClick});

                //finally update available slots for user to select another number
                availableSlots.splice( index, 1);
                this.setState({availableSlots: availableSlots});

                if( availableSlots.length >= 1 ){
                    //Now, allow computer to select the data
                    setTimeout( () =>{
                        this.setComputerSelection();
                    }, 500);
                    
                }
            }
            

        }

        // code to check and declare winner of the game
        if( totalClick >= 4 && checkWinner === '' ){
            this.checkWinner();
        }
        
    }

    setComputerSelection = () => {
        //console.log(this.state);
        
        let CompSelectedData = this.state.ComputerSelectedData;
        let userSelectedData = this.state.UserSelectedData
        let availableSlots = this.state.availableSlots;
        let totalClick = this.state.TotalPlay;
        let checkWinner = this.state.Winner;
        let DifficultLevel = this.state.DifficultLevel;

        if( checkWinner !== '' ){
            return;
        }

        //select a random number from available slots and set the chance for computer
        var randomNumber = availableSlots[Math.floor(Math.random() * availableSlots.length)];
        console.log(randomNumber);
        if( DifficultLevel === 'easy' ){
            CompSelectedData.push( randomNumber );
        }

        //if medium then select 4th value as the next move by computer
        console.log('DifficultLevel: '+DifficultLevel);
        if( DifficultLevel === 'medium' ){
            let winnerArray = this.state.WinnerVerticalArray;
            
            //check for vertical winning by user
            winnerArray.forEach( (verticalItems ) => { 
                let verticalMatchCount = 0;
                var MediumRandom = [];
                MediumRandom.push( randomNumber );
                //console.log( '=======user=============='+userLoopCount+'================' );
                verticalItems.forEach( VerticalMap => {
                    if( userSelectedData.indexOf(VerticalMap) !== -1 ){
                        verticalMatchCount++;
                    }else{
                        if( availableSlots.indexOf(VerticalMap) !== -1 ){
                            MediumRandom.push( VerticalMap );
                        }
                    }
                });
                console.log('user verticalMatchCount: '+verticalMatchCount);
                console.log( MediumRandom );
                if( verticalMatchCount >= 3 ){
                    //user is becoming winner
                    //next move by computer should be to restrict user to win
                    randomNumber = MediumRandom[Math.floor(Math.random() * MediumRandom.length)];
                }
            }); 

            CompSelectedData.push( randomNumber );

        }

        //if difficult then select 3rd and 4th value as the next move by computer
        if( DifficultLevel === 'difficult' ){
            let winnerArray = this.state.WinnerVerticalArray;
            let horiwinnerArray = this.state.WinnerHorizontalArray;
            
            var compNextMove = [];
            compNextMove.push( randomNumber );
            //check for vertical winning by user
            winnerArray.forEach( (verticalItems ) => {
                let verticalMatchCount = 0;
                var MediumRandom = [];
                //MediumRandom.push( randomNumber );
                //console.log( '=======user=============='+userLoopCount+'================' );
                verticalItems.forEach( VerticalMap => {
                    if( userSelectedData.indexOf(VerticalMap) !== -1 ){
                        verticalMatchCount++;
                    }else{
                        if( availableSlots.indexOf(VerticalMap) !== -1 ){
                            MediumRandom.push( VerticalMap );
                        }
                    }
                });
                //console.log('user verticalMatchCount: '+verticalMatchCount);
                
                if( verticalMatchCount >= 2 ){
                    //user is becoming winner
                    //next move by computer should be to restrict user to win
                    
                    MediumRandom.forEach( randVal => {
                        compNextMove.push(randVal);
                    })
                    console.log(compNextMove);
                    //randomNumber = MediumRandom[Math.floor(Math.random() * MediumRandom.length)];
                }
            }); 

            horiwinnerArray.forEach( (horiItems) => {
                var eachRow = horiItems;
                let horiMatchCount = 0;
                var MediumRandom = [];
                //MediumRandom.push( randomNumber );
                //console.log(MediumRandom);
                eachRow.forEach( (rowData) =>{
                    if( userSelectedData.indexOf(rowData) !== -1 ){
                        horiMatchCount++;
                    }else{
                        if( availableSlots.indexOf(rowData) !== -1 ){
                            MediumRandom.push( rowData );
                        }
                    }
                });
                if( horiMatchCount >= 2 ){
                    //user is becoming winner
                    //next move by computer should be to restrict user to win
                    //console.log(MediumRandom);
                    MediumRandom.forEach( (randomItem) => {
                        console.log(randomItem);
                        if( userSelectedData.indexOf(randomItem) === -1 ){
                            compNextMove.push(randomItem);
                        }
                    });
                    //console.log(compNextMove);
                    let unique = [];
                    compNextMove.forEach( (val) => {
                        if( unique.indexOf(val) === -1  ){
                            unique.push(val);
                        }
                    });
                    console.log(unique);
                    //return false;        
                    //randomNumber = compNextMove[Math.floor(Math.random() * compNextMove.length)];
                }
            });
            var finalRandomNumber = [];
            compNextMove.forEach( (nextMove) => {
                if( availableSlots.indexOf(nextMove) !== -1 ){
                    finalRandomNumber.push( nextMove );
                }
            });
            console.log( finalRandomNumber );
            randomNumber = compNextMove[Math.floor(Math.random() * compNextMove.length)];

            console.log(compNextMove);
            
            CompSelectedData.push( randomNumber );
        }

        
        this.setState({ ComputerSelectedData: CompSelectedData});
        //remove the computer selected data from available slot
        var index = this.getIndex( randomNumber , availableSlots );
        if (index !== -1) {
            availableSlots.splice( index, 1);
        }
        //finally update available slots for user to select another number
        this.setState({availableSlots: availableSlots});

        var elem = document.getElementById("radio_"+randomNumber);
        //console.log(elem );
        elem.className += ' computer';
        elem.checked += ' true';
        
        var moveelem = document.getElementById("MoveData");
        //console.log(elem );
        moveelem.className = '';
        
        // code to check and declare winner of the game
        if( totalClick >= 4 && checkWinner === '' ){
            this.checkWinner();
        }
    }


    /*  code to check and define winner of the game  */
    checkWinner = () =>{
        let userData = this.state.UserSelectedData;
        let compData = this.state.ComputerSelectedData;
        //console.log( userData );

        //first check if a user is winner or not
        //check horizontally first
        let usercount;
        let compcount;
        let loopcount = 0;
        let userwinnerIds = [];
        let compwinnerIds = [];
        for(let i = 0; i < 4; i++)
        {
            usercount = 1;
            userwinnerIds = [];
            compcount = 1;
            compwinnerIds = [];
            for(let j=0; j < 5; j++)
            {
                loopcount++;
                //check for user
                if( userData.indexOf(loopcount) !== -1 ){
                    //console.log('found : '+(loopcount), i, j, usercount );
                    userwinnerIds.push( loopcount );
                    usercount++;
                }
                //check for computer
                if( compData.indexOf(loopcount) !== -1 ){
                    //console.log('found : '+(loopcount), i, j, compcount );
                    compwinnerIds.push( loopcount );
                    compcount++;
                }
            }

            //declare user as winner
            if (usercount >= 4 && userwinnerIds.length === 4 )
            {
                //console.log( userwinnerIds );
                userwinnerIds.forEach( (divID) =>{
                    let WinnerElement = document.getElementById('box_'+divID);
                    WinnerElement.className += ' winner';
                });
                this.setState({Winner: 'You'});
                let gameDiv = document.getElementById('gameDiv');
                gameDiv.classList += ' winner';
                this.setState({ShowWinnerDiv: 'show'});
                //console.log('here');
                return;
            }

            //declare comp as winner
            if (compcount >= 4 && compwinnerIds.length === 4 )
            {
                //console.log( userwinnerIds );
                compwinnerIds.forEach( (divID) =>{
                    let WinnerElement = document.getElementById('box_'+divID);
                    WinnerElement.className += ' winner';
                });
                this.setState({Winner: 'Computer'});
                let gameDiv = document.getElementById('gameDiv');
                gameDiv.classList += ' winner';
                this.setState({ShowWinnerDiv: 'show'});
                //console.log('here');
                return;
            }
        }


        //first check if a user is winner or not
        //check horizontally second
        //1,6,11,16
        //2,7,12,17
        //3,8,13,18
        let winnerArray = this.state.WinnerVerticalArray;       
        
        //check for vertical winning by user
        winnerArray.forEach( (verticalItems ) => {
            let verticalMatchCount = 0;
            //console.log( '=======user=============='+userLoopCount+'================' );
            verticalItems.forEach( VerticalMap => {
                if( userData.indexOf(VerticalMap) !== -1 ){
                    verticalMatchCount++;
                }
            });
            //console.log('user verticalMatchCount: '+verticalMatchCount);
            
            if( verticalMatchCount === 4 ){
                //user is winner as vertical data matches
                verticalItems.forEach( (divID) =>{
                    let WinnerElement = document.getElementById('box_'+divID);
                    WinnerElement.className += ' winner';
                });
                this.setState({Winner: 'You'});
                let gameDiv = document.getElementById('gameDiv');
                gameDiv.classList += ' winner';
                this.setState({ShowWinnerDiv: 'show'});
                return false;
            }
        }); 

        //check for vertical winning by computer
        winnerArray.forEach( (verticalItems ) => {
            let verticalMatchCount = 0;
            //console.log( '========comp============='+compLoopCount+'================' );
            verticalItems.forEach( VerticalMap => {
                if( compData.indexOf(VerticalMap) !== -1 ){
                    verticalMatchCount++;
                }
            });
            //console.log('comp verticalMatchCount: '+verticalMatchCount);
            //const compfound = verticalItems.some(r=> compwinnerIds.includes(r));
            if( verticalMatchCount === 4 ){
                //user is winner as vertical data matches
                verticalItems.forEach( (divID) =>{
                    let WinnerElement = document.getElementById('box_'+divID);
                    WinnerElement.className += ' winner';
                });
                this.setState({Winner: 'Computer'});
                let gameDiv = document.getElementById('gameDiv');
                gameDiv.classList += ' winner';
                this.setState({ShowWinnerDiv: 'show'});
                return false;
            }
        });
    }

    setDifficultyLevel = (event) =>{
        localStorage.setItem('Level', event.target.id);
        this.setState({ DifficultLevel: event.target.id });
    }

    refreshPage = () =>{
        window.location.reload(); 
    }

    render(){
        

        return <div>
                <div className="settings">
                    <div className="complexity">
                        <div className="row">
                            <div id="easy" className={(this.state.DifficultLevel === 'easy') ? 'btn easy active' : 'btn easy'} onClick={this.setDifficultyLevel} >Easy</div>
                            <div id="medium" className={(this.state.DifficultLevel === 'medium') ? 'btn medium active' : 'btn medium'} onClick={this.setDifficultyLevel} >Medium</div>
                            <div id="difficult" className={(this.state.DifficultLevel === 'difficult') ? 'btn difficult active' : 'btn difficult'} onClick={this.setDifficultyLevel} >Difficult</div>
                            
                        </div>
                    </div>
                </div>
                <div className="GameArea">
                    <div id="gameDiv" className="gameSection">
                        <div className="row">
                            <div className="gameElement" id="box_1"><input type="radio" data-id="1" onClick={this.checkSelection} name="radio_1" className="radio button" id="radio_1" /></div>
                            <div className="gameElement" id="box_2"><input type="radio" data-id="2" onClick={this.checkSelection} name="radio_2" className="radio button" id="radio_2" /></div>
                            <div className="gameElement" id="box_3"><input type="radio" data-id="3" onClick={this.checkSelection} name="radio_3" className="radio button" id="radio_3" /></div>
                            <div className="gameElement" id="box_4"><input type="radio" data-id="4" onClick={this.checkSelection} name="radio_4" className="radio button" id="radio_4" /></div>
                            <div className="gameElement" id="box_5"><input type="radio" data-id="5" onClick={this.checkSelection} name="radio_5" className="radio button" id="radio_5" /></div>
                        </div>
                    
                        <div className="row">
                            <div className="gameElement" id="box_6"><input type="radio" name="radio_6" data-id="6" onClick={this.checkSelection} className="radio button" id="radio_6" /></div>
                            <div className="gameElement" id="box_7"><input type="radio" name="radio_7" data-id="7" onClick={this.checkSelection} className="radio button" id="radio_7" /></div>
                            <div className="gameElement" id="box_8"><input type="radio" name="radio_8" data-id="8" onClick={this.checkSelection} className="radio button" id="radio_8" /></div>
                            <div className="gameElement" id="box_9"><input type="radio" name="radio_9" data-id="9" onClick={this.checkSelection} className="radio button" id="radio_9" /></div>
                            <div className="gameElement" id="box_10"><input type="radio" name="radio_10" data-id="10" onClick={this.checkSelection} className="radio button" id="radio_10" /></div>
                        </div>
                        <div className="row">
                            <div className="gameElement" id="box_11"><input type="radio" name="radio_11" data-id="11" onClick={this.checkSelection} className="radio button" id="radio_11" /></div>
                            <div className="gameElement" id="box_12"><input type="radio" name="radio_12" data-id="12" onClick={this.checkSelection} className="radio button" id="radio_12" /></div>
                            <div className="gameElement" id="box_13"><input type="radio" name="radio_13" data-id="13" onClick={this.checkSelection} className="radio button" id="radio_13" /></div>
                            <div className="gameElement" id="box_14"><input type="radio" name="radio_14" data-id="14" onClick={this.checkSelection} className="radio button" id="radio_14" /></div>
                            <div className="gameElement" id="box_15"><input type="radio" name="radio_15" data-id="15" onClick={this.checkSelection} className="radio button" id="radio_15" /></div>
                        </div>
                        <div className="row">
                            <div className="gameElement" id="box_16"><input type="radio" name="radio_16" data-id="16" onClick={this.checkSelection} className="radio button" id="radio_16" /></div>
                            <div className="gameElement" id="box_17"><input type="radio" name="radio_17" data-id="17" onClick={this.checkSelection} className="radio button" id="radio_17" /></div>
                            <div className="gameElement" id="box_18"><input type="radio" name="radio_18" data-id="18" onClick={this.checkSelection} className="radio button" id="radio_18" /></div>
                            <div className="gameElement" id="box_19"><input type="radio" name="radio_19" data-id="19" onClick={this.checkSelection} className="radio button" id="radio_19" /></div>
                            <div className="gameElement" id="box_20"><input type="radio" name="radio_20" data-id="20" onClick={this.checkSelection} className="radio button" id="radio_20" /></div>
                        </div>
                    </div>
                    <div id="ResultDiv" className={this.state.ShowWinnerDiv}>
                        <Fireworks {...fxProps} />
                    </div>
                </div>    
                <div id="MoveData" className="hide">
                    <h3>Total Moves : {this.state.TotalPlay}</h3>
                    <div className={this.state.ShowWinnerDiv}>
                        <div className="result">
                            <div className="resultData">
                                <h3>Total Moves : {this.state.TotalPlay}</h3>
                                <h2 className={this.state.ShowWinnerDiv}>Winner : {this.state.Winner}</h2>
                            </div>
                            <div id="start_again" onClick={this.refreshPage} className='restartbtn' >Start Again</div>
                        </div>    
                    </div>
                </div>
                
                
        </div>
    }
}

export default GameElements;  