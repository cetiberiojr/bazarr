import React, { FunctionComponent, MouseEvent } from "react";
import { Column } from "react-table";
import BasicTable from "../components/BasicTable";

import { connect } from "react-redux";

import { Badge } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWrench,
  faCheck,
  faBookmark,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  movies: Array<Movie>;
}

function mapStateToProps({ movie }: StoreState) {
  const { movieList } = movie;
  return {
    movies: movieList.items,
  };
}

const Table: FunctionComponent<Props> = (props) => {
  const { movies } = props;

  const columns: Column<Movie>[] = React.useMemo<Column<Movie>[]>(
    () => [
      {
        Header: "",
        accessor: "monitored",
        Cell: (row) => {
          const monitored = row.value === "True";

          if (monitored) {
            return <FontAwesomeIcon icon={faBookmark}></FontAwesomeIcon>;
          } else {
            return <span></span>;
          }
        },
      },
      {
        Header: "Name",
        accessor: "title",
      },
      {
        Header: "Path Exist",
        accessor: "exist",
        Cell: (row) => {
          const exist = row.value;
          return (
            <FontAwesomeIcon
              icon={exist ? faCheck : faExclamationTriangle}
            ></FontAwesomeIcon>
          );
        },
      },
      {
        Header: "Audio",
        accessor: "audio_language",
        Cell: (row) => {
          const audio_language = row.value;
          return <span>{audio_language.name}</span>;
        },
      },
      {
        Header: "Subtitles Languages",
        accessor: "languages",
        Cell: (row) => {
          const languages = row.value;
          if (languages instanceof Array) {
            const items = languages.map(
              (val: SeriesLanguage): JSX.Element => (
                <Badge className="mx-1" key={val.name} variant="secondary">
                  {val.code2}
                </Badge>
              )
            );
            return items;
          } else {
            return <span />;
          }
        },
      },
      {
        Header: "Hearing-Impaired",
        accessor: "hearing_impaired",
      },
      {
        Header: "Forced",
        accessor: "forced",
      },
      {
        Header: "Missing Subtitles",
        accessor: "missing_subtitles",
        Cell: (row) => {
          const subtitles = row.value;
          return subtitles.map((val) => (
            <Badge className="mx-1" key={val.name} variant="secondary">
              {val.code2}
            </Badge>
          ));
        },
      },
      {
        Header: "",
        accessor: "radarrId",
        Cell: (row) => {
          return (
            <Badge
              as="a"
              href=""
              className="mx-1"
              variant="secondary"
              onClick={(e: MouseEvent) => {
                e.preventDefault();
              }}
            >
              <FontAwesomeIcon icon={faWrench}></FontAwesomeIcon>
            </Badge>
          );
        },
      },
    ],
    []
  );

  return <BasicTable options={{ columns, data: movies }}></BasicTable>;
};

export default connect(mapStateToProps)(Table);
