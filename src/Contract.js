import React, { PureComponent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SimpleReactValidator from "simple-react-validator";
import { Dropdown } from "react-bootstrap";
import "./App.css";
import {BsPlusLg} from "react-icons/bs"
import {BsChevronDoubleDown} from "react-icons/bs"
import axios from "axios";
 
// import Click1 from "../assent/click2.png"
import  {GoArrowRight}  from "react-icons/go"
import { Link } from "react-router-dom";
 
class Contract extends PureComponent {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator();
    this.changeCat = this.changeCat.bind(this);
    this.fnOnchange = this.fnOnchange.bind(this);
    this.state = {
      //- fetch api data
      categoryList: [],
      Rule: [],
      Condition: [],
      Contract_kpi: [],

      //-set state
      Lbound: "",
      Ubound: "",
      conditions: "",
      contractid: "",
      contractdate: "",
      categoryid: "",
      ruleid: "",
      ruleName: "",
      formulaid: "",
      xvalue: "",
      lbound: "",
      ubound: "",

      categoryname: "",
      setShow: false,
      setError: false,
      Inputs: [],
      Inputs1: [],

      setShowLbound: false,
      setShowCondition: false,
      //-display name

      priorityValue: "",
      frequencyValue: "",

      ContractDemoArray: [],

      aaa: "",
    };
    console.log(this.props);

    console.log(this.state);
  }

  componentDidMount() {
    this.changeCat();
    console.log(this.state.Inputs1);

    // this.priorityCompare();
  }

  //- fetch category

  changeCat() {
    axios
      .get("http://demosrvr2.optipacetech.com:8000/api/v1/category/")
      .then((response) => {
        this.setState({
          categoryList: response.data,
          showing: !this.state.showing,
        });
        console.log(response.data);
      });
  }

  //- fetch rules

  rules = (e) => {
    console.log(e.target.value, e.target.key, "asha111");

    this.setState({
      [e.target.name]: e.target.value,
    });

    axios
      .get(
        `http://demosrvr2.optipacetech.com:8000/api/v1/rule/?category_id=${e.target.value}`
      )
      .then((res) => {
        this.setState({
          Rule: res.data,

          submitted: false,
          rule: "Rule",
          priority: "Priority",
          frequency: "Frequency",
        });
        console.log(res.data, "asha");
      });
  };

  //-fetch conditions

  Conditions = (e, eventname) => {
    console.log(e, eventname, "concate");
    this.setState({
      ruleName: eventname,
      ruleid: e,
      conditions: "Condition",
      setShow: true,
    });

    console.log(e);
    axios
      .get(
        `http://demosrvr2.optipacetech.com:8000/api/v1/formula1/?rule_id=${e}`
      )
      .then((res) => {
        this.setState({
          Condition: res.data,

          setShowLbound: false,
          setShowCondition: true,
        });
        console.log(res.data, "condition");
      });

    axios
      .get(
        `http://demosrvr2.optipacetech.com:8000/api/v1/contractkpi/?rule_id=${e}`
      )
      .then((res) => {
        this.setState({
          Contract_kpi: res.data,
          // Inputs1:res.data,
          setShowLbound: true,
        });
        console.log(res.data, this.state.Inputs1.ruleid, "contractkpi");
      });
  };

  changeHandler = (e) => {
    console.log(e, e.target.value, "as");
    this.setState({
      contractid: e.target.value,
    });
  };

  changeDate = (e) => {
    this.setState({
      contractdate: e.target.value,
    });
  };

  inputOnChange = (e) => {
    this.setState({
      setError: false,
      priorityValue: e.target.value,
    });
  };

  inputFrequency = (e) => {
    this.setState({
      frequencyValue: e.target.value,
    });
  };

  //- X value condition

  fnOnchange = (e, index) => {
    console.log(e.target.name, e.target.value);
    this.state.Inputs[index] = {
      value1: e.target.name,
      value2: e.target.value,
    };

    this.setState({ Inputs: this.state.Inputs });
  };

  lowerbound = (e, index) => {
    this.state.Inputs1[index] = {
      value1: e.target.name,
      value2: e.target.value,
    };
    this.setState({ Inputs1: this.state.Inputs1 });

    // this.state.Inputs1[index]={value1:this.state.Inputs1[index].lbound, value2:this.state.Inputs1[index].ubound, value3:e.target.value, }
    // this.setState({Inputs1:this.state.Inputs1})
    console.log(this.state.Inputs1, "LBOUND");
  };

  handleSubmit = (e) => {
    alert(+"A name was submitted: " + JSON.stringify(this.state.ruleid));
    e.preventDefault();

    let inputList = [...this.state.Inputs];
    let inputList1 = [...this.state.Inputs1];
    let MainInput = [];

    for (let i = 0; i < inputList.length; i++) {
      const main = {
        event1: inputList[i].value1,
        event2: null,
        event3: inputList[i].value2,
      };
      MainInput.push(main);
    }

    for (let i = 0; i < inputList1.length; i++) {
      const main = {
        event1: null,
        event2: inputList1[i].value1,
        event3: inputList1[i].value2,
      };
      MainInput.push(main);
    }

    console.log(MainInput);

    axios
      .get(
        `http://demosrvr2.optipacetech.com:8000/api/v1/contractid_demo/?contractid=${this.state.contractid}`
      )
      .then((res) => {
        console.log(res.data);
        this.setState({
          ContractDemoArray: res.data,
        });
        // let ret=true;

        this.state.ContractDemoArray.forEach((index) => {
          let contract = index.contractid;
          let priority = index.priorityid;

          if (this.state.priorityValue == priority) {
            // ret=false;

            this.setState({
              priorityValue: "",
              setError: true,
            });
          }
        });

        for (let i = 0; i < MainInput.length; i++) {
          console.log(this.state.ruleid, "name");
          axios
            .post(
              "http://demosrvr2.optipacetech.com:8000/api/v1/contractid_demo/",
              {
                contractid: this.state.contractid,
                categoryid: this.state.categoryid,
                end_dates: this.state.contractdate,
                ruleid: this.state.ruleid,
                priorityid: this.state.priorityValue,
                frequencyid: this.state.frequencyValue,
                formula: MainInput[i].event1,
                contractkpi: MainInput[i].event2,
                valueofx: MainInput[i].event3,
              }
            )
            .then((res) => {
              console.log(res.data);
              // alert("saved")
              // window.location.reload(false)
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
  };

  render() {
    const {
      categoryList,
      Inputs1,
      Rule,
      Condition,
      Contract_kpi,
      showing,
      contractid,
      categoryid,
      ruleid,
      ruleName,
      formulaid,
      xvalue,
    } = this.state;
    return (
      <div>
      <section>
      {/* <Tab/> */}

        <div
          class="card"
          Style="width: 67rem;margin:0 auto; float:none; margin-bottom:10px; margin-top:1%;margin-left:-21%"
        >
          <div className="card-body">
            <div style={{backgroundColor:'#13255B',position:"relative"}}>
           
          </div>
         
        <br/>
            <form style={{width:'56%'}} onSubmit={this.handleSubmit}>
              <div class="form-group row">
                {/* //d */}
                <label for="contractid" class="col-sm-3 col-form-label">
                  contractId
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="enter a value"
                    name="contractid"
                    defaultValue={contractid}
                    onChange={this.changeHandler}
                  ></input>
                </div>
              </div>
              <br></br>
              <div class="form-group row">
                <label for="contractdate" class="col-sm-3 col-form-label">
                  EndDate
                </label>
               
                <div class="col-sm-9">
                  <input
                    type="date"
                    class="form-control"
                    placeholder="enter a value"
                    name="contractdate"
                    defaultValue={this.state.contractdate}
                    onChange={this.changeDate}
                  ></input>

                </div>
              </div>
              <br/>
             
              <div class="form-group row">
                <label for="inputoption" class="col-sm-3 col-form-label">
                  select category
                </label>
                <div class="col-sm-9">
                  {/* <input type="password" class="form-control" id="inputPassword" placeholder="Password"></input>  idonClick={()=>{this.condition(rule.)}}*/}

                  <select
                 
                    class="form-select"
                    name="categoryid"
                    value={categoryid}
                    id="inputoption"
                    aria-label="Default select example"
                    onChange={this.rules}
                  >
                    <option selected>Open this select categorry</option>
                    {categoryList.map((categoryy, i) => {
                      return (
                        <option key={i} value={categoryy.id}>
                          {categoryy.category}
                        </option>
                      );
                    })}
                  </select>
                  
</div>
    <br/>
<div class="container" Style="width:50rem;">
                  
                  <table>
                    <tbody>
                     
                      {this.state.setShow && (
                        
                       
                          <div Style="display:flex; margin-Rigth:14%">
                            <table>
                              <br/>
                            <div class="form-group row">
              
                  <label  for="contractid" class="col-sm-3 col-form-label">
                  Priority
                  </label>
                  <div class="col-sm-9">
                              <td>  
                                <input style={{marginLeft:'20%',width:'380px'}} 
                                  type="text"
                                  class="form-control"
                                  name="priorName"
                                  defaultValue={this.state.priorityValue}
                                  onChange={this.inputOnChange}
                                ></input>
                                <br></br>
                                {this.state.setError && (
                                  
                                    <span class="text-danger">
                                      this priority was already taken
                                    </span>
                                  
                                )}
                              </td>
                              </div>
                              </div>
                              
                              <div class="form-group row">
                  <label for="inputoption" class="col-sm-3 col-form-label">
                    Frequency
                  </label>
                  <div class="col-sm-9">
                    <td>
                    <select
                     style={{width:'200%',marginLeft:'-3%'}}
                      class="form-select"
                      name="freqName"
                      value={categoryid}
                      id="inputoption"
                      defaultValue={this.state.frequencyValue}
                      aria-label="Default select example"
                       onChange={this.inputFrequency}
                     
                    >
                       
                          <option selected>select frequency</option>
                          <option value="1 day">1 day</option>
                          <option value="2 day">2 day</option>
                          <option value="3 day">3 day</option>
                        
                   
                    </select>
                    </td>
                    </div>
                    </div>
                            </table>
                           
                          </div>
                         
                      )}
                    </tbody>
                  </table>
                </div>
</div>
<div>
                
             
              <div  
                class="container" style={{width:"50rem",marginRight:'10%'}}
                submitted={this.state.submitted}
              >
                   
                <table
                  class="table table-borderless"
                  borer="0"
                  style={{marginLeft :"29rem",marginTop:'-221px'}}
                  
                >
                  <thead>
                    <tr>
                      <th scope="col">{this.state.rule}</th>
                    </tr>
                  </thead>

                  <tbody>
                    
                    {Rule.map((rule, index) => {
                      return (
                     
                        <tr key={index}>
                         
                          <td>
                         {/* <div><img src={Click1}/> </div> */}
                            {/* <ul><li> */}
                            
                            <button
                             className="item"
                              Style="margin-left:12rem; margin-top:-1rem ;float:left; color:white;background:#13255B;width:22.5rem;"
                              type="text"
                              name="ruleName"
                              value={ruleName}
                              onClick={() => {
                                this.Conditions(rule.id, rule.rule_name);
                              }}>
                                 <GoArrowRight style={{marginRigth:'60px'}}/>
                             <span>
                            
                              {rule.rule_name}<BsChevronDoubleDown/></span>
                            </button>
                           
                           
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
               
              </div>
              <br/>
                  {/* <div class="container" Style="width:50rem;">
                  
                <table>
                  <tbody>
                   
                    {this.state.setShow && (
                      
                      <div>
                        <div Style="display:flex; margin-Rigth:10%">
                          <table>
                          <div class="form-group row">
               
                <label  for="contractid" class="col-sm-3 col-form-label">
                Priority
                </label>
                <div class="col-sm-9">
                            <td style={{width:'365px'}}>  
                              <input style={{width:'109%',marginLeft:'-2%'}} 
                                type="text"
                                class="form-control"
                                name="priorName"
                                defaultValue={this.state.priorityValue}
                                onChange={this.inputOnChange}
                              ></input>
                              <br></br>
                              {this.state.setError && (
                                
                                  <span class="text-danger">
                                    this priority was already taken
                                  </span>
                                
                              )}
                            </td>
                            </div>
                            </div>
                            
                            <div class="form-group row">
                <label for="inputoption" class="col-sm-3 col-form-label">
                  Frequency
                </label>
                <div class="col-sm-9">
                  <td>
                  <select
                   style={{width:'200%',marginLeft:'-3%'}}
                    class="form-select"
                    name="freqName"
                    value={categoryid}
                    id="inputoption"
                    defaultValue={this.state.frequencyValue}
                    aria-label="Default select example"
                     onChange={this.inputFrequency}
                   
                  >
                     
                        <option selected>select frequency</option>
                        <option value="1 day">1 day</option>
                        <option value="2 day">2 day</option>
                        <option value="3 day">3 day</option>
                      
                 
                  </select>
                  </td>
                  </div>
                  </div>
                          </table>
                         
                        </div>
                      </div>
                    )}
                  </tbody>
                </table>
              </div> */}
              <div Style="width:90rem margin:0 auto;  margin-bottom:10px; margin-top:5%">
                <table
                  class="table table-borderless"
                  borer="0"
                  Style="margin-top:5% ;margin-left:27%"
                >
                  {this.state.setShow && (
                    <tr>
                      <h6 style={{marginLeft:'15%'}}>{this.state.conditions}</h6>
                    </tr>
                  )}

                  <tbody>
                    {Condition.map((item, index) => {
                      return (
                        <div key={index}>
                          <div Style="display:flex; margin-left:14rem ">
                            <table Style="width:100%">
                              <td>
                                <input

                                  Style="width:250%; margin-left: -82%"
                                  type="text"
                                  value={item.condition}
                                />
                              </td>
                              <td>
                                <input
                                style={{marginLeft:"120%"}}
                                  type="text"
                                  class="col-sm-4"
                                  name={item.id}
                                  // value={i}
                                  onChange={(e) => {
                                    this.fnOnchange(e, index);
                                  }}
                                />
                              </td>
                              
                            </table>
                          
                          </div>
                          <div style={{marginTop:'-10%',marginLeft:'115%'}}>
                            
                             <BsPlusLg  size='2em' backgroundColor='lavender'/>

               
                              </div>
                              
                        </div>
                        
                           
                      
                      );
                      
                    })}

                    <div Style="display:flex; margin-left:10rem">
                      <table>
                        {/* {this.state.setShowLbound &&(
                                                    <tr><td>lbound</td></tr>
                                                 )}  */}
                        {Contract_kpi.map((item, index) => {
                          
                          return (
   
                            <tr key={index}>
                              <td>
                                {" "}
                                <input
                                  class="col-sm-4"
                                  type="text"
                                  value={item.lbound}
                                ></input>
                              </td>
                                 
                              <td>
                                <input
                                  class="col-sm-4"
                                  type="text"
                                  value={item.ubound}
                                ></input>
                              </td>
                              <td>
                                <input
                                  class="col-sm-4"
                                  type="text"
                                  name={item.id}
                                  onChange={(e) => {
                                    this.lowerbound(e, index);
                                  }}
                                  
                                ></input>
                              </td>
 
 
                             
                            </tr>
                          );
                        })}
                      </table>
                  
                    </div>

                 
                  </tbody>
                </table>
              </div>
 
 <br/>
 <br/><br/><br/>  <br/>
 <br/><br/><br/> 
              <div class="form-group row" style={{marginLeft:'23%'}}>
                <div class="col-sm-4">
                  {" "}
                  <button className="btn btn-success">Submit</button>
                </div>

                <div class="col-sm-4">
                  {/* <Link to={"/contractdisplay"}> */}
                    <button className="btn btn-primary">View</button>
                  {/* </Link> */}
                </div>
                <div class="col-sm-4">
                  {/* <Link to={"/contractview"}> */}
                    <button className="btn btn-primary">Add</button>
                  {/* </Link> */}
                </div>
              </div>
              
              
            
              </div>
              <br/>
              

               
              
              <br/>
               <br/>
              </form>
              </div>
        
              </div>
            
              </section>
             
              
       
              </div>
        
     
      
    );
  }
}

export default Contract;
