import { useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Form,
  Pagination,
  ButtonGroup,
  Table,
} from "react-bootstrap";
import Router, { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import ApiService from "../utils/api";
import Header from "./layout/header";
import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, Comparator, selectFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import qee from "qf-export-excel"
import moment from 'moment'
import { ConnectContactLens } from "aws-sdk";





const apiService = new ApiService();

export default function home(props) {
  const [activePage, setActivePage] = useState(1);
  const [allPageNumber, setAllPageNumber] = useState([]);
  const [perPage, setPerPage] = useState(20);
  const [companys, setCompanys] = useState([]);
  const [products, setProducts] = useState([]);
  const [branch, setBranch] = useState([]);
  const [sBranch, setSbranch] = useState("");
  const [sProduct, setSproduct] = useState("");
  const [sDate, setSdate] = useState("");
  const [constValue, setConstvalue] = useState([]);

  // const ExcelFile = ReactExport.ExcelFile;
  // const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  // const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  const columns = [
    {
      dataField: 'Index',
      text: '№',
    },
    {
      dataField: 'SaleNo',
      text: 'Гүйлгээний дугаар',
    }, {
      dataField: 'StationName',
      text: 'Салбарын нэр',
      filter: textFilter({
        onFilter: filterVal => {
          companys.filter((i) => i.StationName === filterVal)
        }
      })
    },
    {
      dataField: 'ItemName',
      text: 'Бүтээгдэхүүн'

    },
    {
      dataField: 'Quantity',
      text: 'Тоо Хэмжээ'
    },
    {
      dataField: 'CardAmount',
      text: 'Картаар төлсөн ',
      filter: textFilter({
        onFilter: filterVal => {
          companys.filter(i => i.CardAmount === filterVal)
        }
      })
    },
    {
      dataField: 'CashAmount',
      text: 'Бэлнээр төлсөн',
      filter: textFilter({
        onFilter: filterVal => {
          companys.filter(i => i.CashAmount === filterVal)
        }
      })
    },

    {
      dataField: 'SaleDate',
      text: 'Гүйлгээний хугацаа'
    }
  ];


  let titleList = [{
    key: 'Index',
    title: '№',
  }, {
    key: 'SaleNo',
    title: 'Гүйлгээний дугаар',
  }, {
    key: 'StationName',
    title: 'Салбарын нэр',
  },
  {
    key: 'ItemName',
    title: 'Бүтээгдэхүүн',
  },
  {
    key: 'Quantity',
    title: 'Тоо Хэмжээ',
  },
  {
    key: 'CardAmount',
    title: 'Картаар төлсөн',
  },
  {
    key: 'CashAmount',
    title: 'Бэлнээр төлсөн',
  },
  {
    key: 'SaleDate',
    title: 'Гүйлгээний хугацаа',
  }

  ]

  const expo = () => {
    qee(titleList, companys, "Тайлан.xls")
  }

  React.useEffect(() => {
    if (!localStorage.getItem("Authorization")) {
      //   Router.push("/login");
    }
    try {
      async function fetchData() {
        await loadData(activePage, perPage);
      }
      fetchData();
    } catch (err) {
      console.log("err occured: ", err);
    }
  }, []);

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const loadData = async (pageNumber, per_page, keyword) => {
    const resp = await apiService.getCompany();
    if (resp.success) {
      let tmp = []
      tmp = resp.data;
      tmp.map((i, idx) => {
        i.Index = idx + 1;
        i.SaleDate = moment(i.SaleDate).format("YYYY-MM-DD hh:mm");
      })
      setCompanys(tmp);
      setConstvalue(tmp);
      let tmp1 = [...new Set(tmp.map(i => i.ItemName))];
      let tmp2 = [...new Set(tmp.map(i => i.StationName))];

      setProducts(tmp1);
      setBranch(tmp2);




    } else {
    }
  };
  const changePage = async (number) => {
    let tmp = activePage;
    if (number.toString() === "back" && activePage > 1) {
      tmp = tmp - 1;
      setActivePage(tmp);
      await loadData(tmp, perPage);
    }
    if (
      number.toString() === "forward" &&
      activePage < Math.max(...allPageNumber)
    ) {
      tmp = tmp + 1;
      setActivePage(tmp);
      await loadData(tmp, perPage);
    }
    if (number.toString() !== "forward" && number.toString() !== "back") {
      setActivePage(number);
      await loadData(number, perPage);
    }
  };

  const filteData = async (type, value) => {

    let tmp = [...constValue];
    if (type === "branch") {
      if (value && value !== "0") {
        tmp = tmp.filter(j =>
          j.StationName === value
        )
        if (sDate) {
          tmp = tmp.filter(j =>
            j.SaleDate.substring(0, 10) === sDate
          )
        }
      }
      setCompanys(tmp);
      setSbranch(value);
    }
    if (type === "product") {

      if (value && value !== "0") {
        tmp = tmp.filter(j =>
          j.ItemName === value
        )
      }
      setCompanys(tmp);
      setSproduct(value);

    }
    if (type === "date") {
      if (value && value !== "0") {
        tmp = tmp.filter(j =>
          j.SaleDate.substring(0, 10) === value
        )

      }
      if (sProduct && sProduct !== "0") {
        tmp = tmp.filter(j =>
          j.StationName === sProduct
        )
      }
      setCompanys(tmp);
      setSdate(value);
    }

  }

  const clearData = () => {
    let tmp = [...constValue];
    setCompanys(tmp);
    setSproduct("0");
    setSbranch("0");
    setSdate(null);
  }


  return (
    <>
      <Header />
      <Container>
        <Row style={{ marginTop: "50px" }}>
          <Row style={{ width: "100%" }}>
            <Col xs={12} style={{ marginTop: "26px" }}>
              {companys && companys.length > 0 && (
                <>
                  <h4> Гүйлгээнүүд</h4>
                </>
              )}
            </Col>
            <Row>
              <Col xs={12} md={3} style={{ marginTop: "26px", float: "right" }}>
                <Form.Control as="select" value={sBranch} onChange={e => {
                  filteData("branch", e.target.value)
                }}
                >
                  <option value="0"> Салбар сонгох  </option>
                  {branch &&
                    branch.map((item, index) => (
                      <>
                        <option value={item}> {item} </option>
                      </>
                    ))}
                </Form.Control>
              </Col>
              <Col xs={12} md={2} style={{ marginTop: "26px", float: "right" }}>
                <Form.Control as="select"
                  onChange={e => {
                    filteData("product", e.target.value)
                  }} >
                  <option value="0"> Бүтээгдэхүүн сонгох  </option>
                  {products &&
                    products.map((item, index) => (
                      <>
                        <option value={item}> {item} </option>
                      </>
                    ))}
                </Form.Control>
              </Col>
              <Col xs={12} md={2} style={{ marginTop: "26px", float: "right" }}>
                <Form.Control value={sDate} placeholder="Өдөр сонгох" style={{ borderRadius: "16px" }} type="date"
                  onChange={e => {
                    filteData("date", e.target.value)
                  }} />
              </Col>
              <Col xs={12} md={2} style={{ marginTop: "26px", float: "right" }}>
                <Button onClick={clearData} > Clear filter </Button>
              </Col>
              <Col xs={12} md={2} style={{ marginTop: "26px", float: "right" }}>
                <Button onClick={expo} > Export Excel </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={12} style={{ marginTop: "26px" }}>
                <BootstrapTable keyField='id' data={companys} columns={columns} filter={filterFactory()} />
              </Col>
            </Row>
          </Row>

          <style jsx>{`
            .box {
            }
          `}</style>

          <style jsx global>{``}</style>
        </Row>
        <ToastContainer />
      </Container >
    </>
  );
}
