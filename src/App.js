import React, { useEffect, useState } from "react";
import "./App.css";

import { MdDeleteForever } from "react-icons/md";

export default function App() {
  const [curBal, setCurBal] = useState(0.0);
  const [curExp, setCurExp] = useState(0.0);
  const [curInc, setCurInc] = useState(0.0);
  const [history, setHistory] = useState([]); // { desc: string, amt: ± number }
  const [transType, setTransType] = useState("exp");

  const [input, setInput] = useState({ desc: "", amt: 0 });

  useEffect(() => {
    var inLocal = localStorage.getItem("history");
    if (inLocal != null) {
      setHistory(JSON.parse(inLocal));
    }
  }, []);

  useEffect(() => {
    let tempCB = 0;
    let tempCE = 0;
    let tempCI = 0;
    history.forEach((elem) => {
      tempCB += elem.amt;
      if (elem.amt < 0) {
        tempCE += elem.amt;
      } else {
        tempCI += elem.amt;
      }
    });
    setCurBal(tempCB);
    setCurExp(tempCE * -1);
    setCurInc(tempCI);
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  function removeFromHistory(index) {
    var tempHistory = history;
    var newHistory = [];
    tempHistory.forEach((element, oldIndex) => {
      if (oldIndex !== index) {
        newHistory.push(element);
      }
    });
    setHistory(newHistory);
  }

  function onChange(str) {
    var xyz = document.querySelectorAll("form .btn-chg div");

    xyz.forEach((e) => {
      e.classList.remove("changer");
      if (e.classList.contains(str)) {
        e.classList.add("changer");
      }
    });
    setTransType(str);
  }

  return (
    <div id="home">
      <h1>Expense Tracker</h1>
      <div className="expense">
        <span>YOUR BALANCE</span>
        <h2>₹ {curBal}</h2>
      </div>
      <div className="trans-box">
        <div style={{ textAlign: "center", width: "48%" }}>
          <span>INCOME</span>
          <p>₹ {curInc}</p>
        </div>
        <div className="v-rule"></div>
        <div style={{ textAlign: "center", width: "48%" }}>
          <span>EXPENSE</span>
          <p>₹ {curExp}</p>
        </div>
      </div>
      <div className="history">
        <h3>History</h3>
        {history.map((oneTrans, index) => {
          return (
            <div className={oneTrans.amt < 0 ? "neg" : "pos"} key={index}>
              <button
                onClick={() => {
                  removeFromHistory(index);
                }}
              >
                <MdDeleteForever />
              </button>
              <span>{oneTrans.desc}</span>
              <span>{oneTrans.amt}</span>
            </div>
          );
        })}
      </div>
      <div className="trans">
        <h3>Add new Transactions</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.desc === "" || input.amt <= 0) {
              alert("Wrong Inputs!!!");
            } else {
              var amount = input.amt * (transType === "exp" ? -1 : 1);
              setHistory([...history, { amt: amount, desc: input.desc }]);
            }

            e.target.reset();
          }}
        >
          <label htmlFor="form_desc">Descripton</label>
          <input
            required={true}
            type="text"
            id="form_desc"
            placeholder="Enter Description"
            onChange={(e) => {
              setInput({ ...input, desc: e.target.value });
            }}
          />
          <label htmlFor="amt">Amount</label>
          <input
            required={true}
            type="number"
            min={1}
            id="amt"
            placeholder="Enter Amount"
            onChange={(a) => {
              setInput({ ...input, amt: parseInt(a.target.value) });
            }}
          />
          <div className="btn-chg">
            <div
              className="inc"
              onClick={(e) => {
                onChange("inc");
              }}
            >
              Income
            </div>
            <div
              className="exp changer"
              onClick={(e) => {
                onChange("exp");
              }}
            >
              Expense
            </div>
          </div>
          <small>Green or Red is the selected one</small>
          <button type="submit" disabled={input.desc === ""}>
            Add transaction
          </button>
        </form>
      </div>
    </div>
  );
}
