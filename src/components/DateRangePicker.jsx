import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { addDays, format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import data from "../data";

const DateRangePickerComp = () => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedVal, setSelectedVal] = useState("all");
  const calenderRef = useRef(null);
//   console.log(selectedVal);
  useEffect(() => {
    document.addEventListener("click", handleClose);
  }, []);

  const handleClose = (e) => {
    if (calenderRef.current && !calenderRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  // date range filter
  const dateStart = format(range[0].startDate, "yyyy-MM-dd");
  const dateEnd = format(range[0].endDate, "yyyy-MM-dd");
  const filteredData = data.filter(
    (item) => item.date >= dateStart && item.date <= dateEnd
  );
  // name filter
  const filteredNames = filteredData.filter((item) =>
    item.name.toLowerCase().includes(name.toLowerCase())
  );
  // amount filter
  const Mapping = {
    "all": (item) => true, 
    ">=100" : (item) => item.amount >= 100,
    "<=200" : (item) => item.amount <= 200,
    "100~200": (item) => item.amount >= 100 && item.amount <= 200,
  }
  const filteredAmount = filteredNames.filter((item) => Mapping[selectedVal](item));

  return (
    <div>
      <h2>React Date Range Picker</h2>
      <div ref={calenderRef}>
        <input
          value={`${format(range[0].startDate, "dd/MM/yyyy")} to ${format(
            range[0].endDate,
            "dd/MM/yyyy"
          )}`}
          readOnly
          onClick={() => setOpen(!open)}
        />
        {open && (
          <DateRangePicker
            date={new Date()}
            onChange={(item) => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
          />
        )}
      </div>
      {filteredData && (
        <>
          <h3>Data Fetched</h3>
          <table>
            {filteredAmount.map((item) => (
              <tr>
                <td>{item.date}</td>
                <td>{item.name}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
          </table>
          <br />
          <input
            type="text"
            placeholder="Search Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={selectedVal}
            onChange={(e) => setSelectedVal(e.target.value)}
          >
            <option>Filter by amount</option>
            <option value=">=100">More than 100</option>
            <option value="<=200">Less than 200</option>
            <option value="100~200">100 ~ 200</option>
          </select>
        </>
      )}
    </div>
  );
};

export default DateRangePickerComp;
