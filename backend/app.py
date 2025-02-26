from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/message', methods=['GET'])
def get_message():
    return jsonify({'message': '¡Hola desde Flask!'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
