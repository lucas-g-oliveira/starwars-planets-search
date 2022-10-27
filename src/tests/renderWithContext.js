import React from "react";
import { render } from "@testing-library/react";
import Provider from "../context/Provider";

export default function renderWithContext(children){
  return(
    render(
      <Provider>
        {children}
      </Provider>
    )
  );
}