from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/test', methods=['GET'])
def test():
    return render_template('test.html')

@app.route('/profile', methods=['GET'])
def profile():
    return render_template('profile.html')



if __name__ == "__main__":
    app.run(debug=True)