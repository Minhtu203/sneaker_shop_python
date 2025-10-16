function DefaultLayout(props) {
  const { className, ...prop } = props;
  return (
    <div className={`${className}`} {...prop}>
      {props.children}
    </div>
  );
}

export default DefaultLayout;
