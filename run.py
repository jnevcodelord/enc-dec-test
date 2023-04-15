
from no_sql_db import DB, Table
from bottle import Bottle, static_file,template,request
encrypted_message = 'hi'
DBase = DB()

app = Bottle()

@app.route('/static/<filename:path>')
def serve_static(filename):
    return static_file(filename, root='static/')

# Route for serving static JavaScript files
@app.route('/static/scripts/myscript.js')
def serve_js():
    print("HI!")
    return static_file('myscript.js', root='static/scripts')

@app.route('/')
def index():
    # Render your HTML template that includes the JavaScript file
    return template('base.html')


@app.route('/sendmessage', method=['POST'])
def catchMessage(): 
    encrypted_message = request.json.get("message")
    print(encrypted_message)

    if encrypted_message:
        print(encrypted_message)
        data = encrypted_message
        DBase.set_message(data)
        return 'Message received and processed successfully.'
    else:
        return 'Error: No message received.'


@app.route('/publickey', method=['POST'])
def catchkey(): 
    publickey = request.json.get("key")
   
    if publickey:
        
        DBase.set_key(publickey)
        return 'Message received and processed successfully.'
    else:
        return 'Error: No message received.'


@app.route('/checkmessages', method = 'GET')
def checkMessage():
     message = DBase.get_message()
     return {'message':message}
     
@app.route('/checkmessages1', method = 'GET')
def checkMessage():
     message = DBase.get_message()
     return {'message':message}

@app.route('/checkKey', method = 'GET')
def checkMessage():
     pubkey = DBase.get_key()
     return {'key':pubkey}







app.run(host='localhost', port=8092, debug=True)
