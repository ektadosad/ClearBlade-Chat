//code for toggle display.
function isDefined(val) { return val != null; }

var ToggleDisplay = React.createClass({
    
    propTypes: {
        hide: React.PropTypes.bool,
        show: React.PropTypes.bool
    },
    
    shouldHide: function() {
        var shouldHide;
        if(isDefined(this.props.show)) {
            shouldHide = !this.props.show;
        }
        else if(isDefined(this.props.hide)) {
            shouldHide = this.props.hide;
        }
        else {
            shouldHide = false;
        }
        
        return shouldHide;
    },
    
    render: function() {
        var style = {};
        
        if(this.shouldHide()) {
            style.display = 'none';
        }
        
        return (
        <span style={style} {...this.props} />
        );
    }
    
});

//global vairables.
var cb = new ClearBlade();
var messaging = {};
var chat = "";
var messageToSend="";

//Single page app component.
var App = React.createClass({
    getInitialState: function() {
        return {
            show: true,
            user: "",
            message: "",
        };
    },
    
    // Invoked once, immediately before the initial rendering occurs.
    componentWillMount: function() {
        var initCallback = function(err, response){
            if(err){
                alert("callback");
            }
            else {
                var establishConnection = function(data) {
                    if(err) {
                        alert("CANNOT CONNECT");
                    }
                    else {
                        // alert("CONNECTED : " + JSON.stringify(data));
                    }
                }
                //messaging = cb.Messaging({"USER" : {email:"test@clearblade.com"}}, establishConnection);
                messaging = cb.Messaging({}, establishConnection);
                //alert("Init success!");
            }
        }
        //clearBlade connection
        var initOptions = {
            URI : "https://platform.clearblade.com",
            messagingURI : "platform.clearblade.com",
            systemKey: "94a3a7e60ad48fc8dfc1d1bbdff901",
            systemSecret: "94A3A7E60AF6F5D2F9CBCDCFCE08",
            messagingPort: 8903,
            useMQTT: true,
            cleanSession: true,
            email: "test@clearblade.com",
            password: "clearblade",
            callback: initCallback,
        };
        cb.init(initOptions);
        
    },
    
    //log in function.
    handleClick: function() {
        var USER = document.getElementById("username").value
        if(!USER || USER.length === 0){
            document.getElementById("errorMessage").innerHTML="Pleae enter valid username";
        }
        else{
            this.setState({ show: !this.state.show });
            var username = this.state.user;
            document.getElementById("chat").innerHTML =  "Welcome " + username;
            var col = cb.Collection("aaa4a7e60ae2d9b7aad283c1a1db01");
            var query = cb.Query("aaa4a7e60ae2d9b7aad283c1a1db01");
            query.equalTo('username', username);
            var callback = function(err, data){
                if (data.length === 0){
                    col.create({'username':username},function(err, data){
                    });
                }
            }
            col.fetch(query, callback);
            
            var collection = cb.Collection("e6c6bbe60ad2e4e38fa7f1e9cf7d");
            collection.fetch(function (err, data) {
                if (err) {
                    alert("err here 2");
                } else {
                    //alert(data[0].data.chat);
                    chat =  data[0].data.chat;
                    //alert(chat);
                    
                }
            });
            
            messageToSend="";
            var receivedMessage=function(text) {
                messageToSend = messageToSend + '\n' +text;
                document.getElementById("chatDisplay").value = messageToSend;
            };
            var establishConnection = function(data) {
                //alert("establishConnection" + JSON.stringify(data));
                messaging.subscribe("/clearBladeChat", {}, receivedMessage);
            };
            //alert("Create object");
            messaging = cb.Messaging({}, establishConnection);
        }
    },
    
    goBack: function(){
        this.setState({ show: !this.state.show });
    },
    
    // handler function for managing input state
    handleTextChange: function(e) {
        this.setState({user: e.target.value});
    },
    
    handleMessageChange: function(e) {
        this.setState({message: e.target.value});
    },
    
    //function for submitting chat
    submitChat: function(){
        var text = this.state.user + " :" + this.state.message;
        messaging.publish("/clearBladeChat", text);
        //alert("Here trying to connect.=" + cb);
        document.getElementById("message").value = "";
    },
    
    // React entry point
    //Render function for returning html display with the data
    render: function() {
        return (
        <div>
        <ToggleDisplay show={this.state.show}>
        <div id = "view">
        <input id = "username"  type = "text" placeholder= "User Name"
        value = {this.state.user} onChange = {this.handleTextChange}/>
        <div id="errorMessage"></div>
        
        <br/>
        <button onClick={ this.handleClick }>Get Started</button>
        </div>
        </ToggleDisplay>
        <ToggleDisplay hide={this.state.show}>
        
        <div id = "chatContent">
        <div id="chat"></div>
        <textarea id = "chatDisplay" rows="21" cols="60" disabled="true">
        </textarea>
        <br/>
        <input class = "message" id = "message"  type = "text" placeholder= "Type your messgae here"
        value = {this.state.messgae} onChange = {this.handleMessageChange} />
        <button class="submit" onClick = {this.submitChat}> Send </button>
        <br/>
        <button id = "back" onClick={ this.goBack }>Back</button>
        </div>
        </ToggleDisplay>
        
        </div>
        
        );
    }
});

React.render(<App />, document.getElementById('container'));

