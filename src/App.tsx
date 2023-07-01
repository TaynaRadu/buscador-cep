import * as React from "react";
import { ChangeEvent, useState } from "react";
import { FiSearch } from "react-icons/fi";

import "./App.css";

type Data = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<Data | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const loadData = () => {
    if (input === "") {
      alert("Preencha algum Cep!");
      return;
    }

    if (data && input.replace("-", "") === data.cep.replace("-", "")) {
      return;
    }

    setData(undefined);
    setIsLoading(true);
    setMessage("");

    fetch(`https://viacep.com.br/ws/${input}/json`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch(() => setMessage("CEP nao encontrado"))
      .finally(() => setIsLoading(false));
  };

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      loadData();
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Buscador CEP</h1>

        <div className="containerInput">
          <input
            type="text"
            placeholder="Digite seu CEP"
            value={input}
            onChange={handleInputChange}
            onKeyUp={handleInputKeyUp}
          />
          <button className="buttonSearch" onClick={loadData}>
            <FiSearch size={25} color="#fff" />
          </button>
        </div>

        {isLoading && <h2>Carregando...</h2>}
        {message && <h2>{message}</h2>}

        {!isLoading && data && (
          <main className="main">
            <h2>CEP: {data.cep}</h2>
            <span>{data.logradouro}</span>
            <span>Complemento: {data.complemento}</span>
            <span>{data.bairro}</span>
            <span>
              {data.localidade} - {data.uf}
            </span>
          </main>
        )}
      </div>
    </>
  );
}

export default App;
