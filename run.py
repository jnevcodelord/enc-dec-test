
from no_sql_db import DB, Table
from bottle import Bottle, static_file,template,request
encrypted_message = 'hi'

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


@app.route('/sendmessage', methods=['POST'])
def catchMessage(): 

    encrypted_message = request.json.get("message")

    if encrypted_message:
        data = [encrypted_message]
        DB.create_table_entry('messages', data)
        return 'Message received and processed successfully.'
    else:
        return 'Error: No message received.'
    




app.run(host='localhost', port=8092, debug=True)