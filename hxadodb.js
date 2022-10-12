'use strict';

module.exports = function(RED) {
    
    const ADODB = require('node-adodb');
    var connection;
    
    function test(config)
    {
        RED.nodes.createNode(this, config);
        var node = this;
        //this.prefix = config.prefix;
        node.status({ fill: 'yellow', shape: 'ring', text: 'In attesa...' });
        let _Provider = '';
        let _Source = '';
        let _Query = '';
        
        if(config.provider !== undefined && config.provider !== null)
        {
            _Provider = config.provider;
        }
        if(config.source !== undefined && config.source !== null)
        {
            _Source = config.source;
        }
        if(config.query !== undefined && config.query !== null)
        {
            _Query = config.query;
        }
        
        node.on('input', function(msg) 
        {
            if(msg.provider !== undefined && msg.provider !== null)
            {
                _Provider = msg.provider;
            }
            if(msg.source !== undefined && msg.source !== null)
            {
                _Source = msg.source;
            }
            if(msg.query !== undefined && msg.query !== null)
            {
                _Query = msg.query;
            }
          
            if(_Provider !== '' && _Source !== '')
            {
                connection = ADODB.open('Provider='+ _Provider + ';Data Source='+_Source+';');
                if(_Query !== '')
                {
                    connection
                    .query(_Query)
                    .then(data => {
                        node.status({ fill: 'green', shape: 'dot', text: 'Eseguto con successo' });
                        node.send({ payload: data });
                    })
                    .catch(error => {
                        node.status({ fill: 'red', shape: 'ring', text: error });
                        node.send({ payload: null });
                    });
                }else{
                    node.status({ fill: 'red', shape: 'ring', text: 'Query assente.' });
                    node.send({ payload: null });
                }
            }else{
                node.status({ fill: 'red', shape: 'ring', text: 'Parametri connessione mancanti.' });
                node.send({ payload: null });
            }
        });
    };
    RED.nodes.registerType('hx-adodb-connect', test);
    /**************************************************************
    **** ********
    ***************************************************************/
}
