export function handleTableCellClick(
    state,
    rowInfo,
    column,
    instance,
    ...rest
  ) {
    if (typeof rowInfo !== "undefined") {
      const needsExpander =
        rowInfo.subRows && rowInfo.subRows.length > 1 ? true : false;
 //     const expanderEnabled = !column.disableExpander;
      const expandedRows = Object.keys(this.state.expanded)
        .filter(expandedIndex => {
          return this.state.expanded[expandedIndex] !== false;
        })
        .map(Number);
  
      const rowIsExpanded =
        expandedRows.includes(rowInfo.nestingPath[0]) && needsExpander
          ? true
          : false;
      const newExpanded = !needsExpander
        ? this.state.expanded
        : rowIsExpanded && expanderEnabled
        ? {
            ...this.state.expanded,
            [rowInfo.nestingPath[0]]: false
          }
        : {
            ...this.state.expanded,
            [rowInfo.nestingPath[0]]: {}
          };
  
          return {
            onClick: (e, handleOriginal) => {
            this.setState({
                expanded: newExpanded
            });
            }
        };
    } else {
      return {
        onClick: (e, handleOriginal) => {
          if (handleOriginal) {
            handleOriginal();
          }
        }
      };
    }
  }