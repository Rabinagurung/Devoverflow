import React from "react";

import { EMPTY_ANSWERS } from "@/constants/states";

import AnswerCard from "../cards/AnswerCard";
import DataRenderer from "../DataRenderer";
interface Props extends ActionResponse<Answer[]> {
  totalAnswers: number;
}

const AllAnswers = ({ success, data, error, totalAnswers }: Props) => {
  return (
    <div className="mt-11 ">
      <div className="flex justify-between items-center">
        <h3 className="primary-text-gradient ">
          {totalAnswers} {totalAnswers > 1 ? "Answers" : "Answer"}
        </h3>
        <div>Filter</div>
      </div>
      <DataRenderer
        success={success}
        data={data}
        error={error}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
        }
      />
    </div>
  );
};

export default AllAnswers;
