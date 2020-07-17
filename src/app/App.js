import React, { Component } from "react";

class App extends Component {

    constructor() {
        super();
        this.state = {
            legoName: '',
            sqlRaw: '',
            formResponse: ''
        }
        this.convertSqlToXml = this.convertSqlToXml.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    convertSqlToXml(e) {
        e.preventDefault();
        console.log(this.state);

        fetch('http://localhost:80/api/converter', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                window.M.toast({ html: 'SQL converted sucessfully' });
                this.setState({ formResponse: data });
            })
            .catch(err => console.error(err));

    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div>
                <nav className="light-blue darken-4">
                    <div className="container">
                        <a className="brand-logo">Manflack Industries</a>
                    </div>
                </nav>

                <div className="container">
                    <div className="card">
                        <div className="card-content">
                            <form onSubmit={this.convertSqlToXml}>
                                <div className="row">
                                    <div className="input-field">
                                        <input name="legoName" onChange={this.handleChange} value={this.state.legoName} type="text" placeholder="Nombre del modulo, pj: users-api" />
                                    </div>

                                    <div className="input-field">
                                        <textarea name="sqlRaw" onChange={this.handleChange} value={this.state.sqlRaw} placeholder="SQL inserts, pj: insert into manflackConfig (col1, col2) values ('key', 'value');" className="materialize-textarea" />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-blue darken-4">Convertir</button>

                                <div>
                                    <div>Insert's XML:<textarea value={this.state.formResponse[0]} type="text" className="materialize-textarea" /></div>

                                    <div>Rollback's XML:<textarea value={this.state.formResponse[1]} type="text" className="materialize-textarea" /></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>

        )
    }
}

export default App;