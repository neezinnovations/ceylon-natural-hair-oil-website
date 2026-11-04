import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") console.error(error, info);
  }

  render() {
    if (this.state.failed) {
      return <main className="route-loading" role="alert">
        <h1>Something went wrong.</h1>
        <p>Please reload the page to try again.</p>
        <button onClick={() => window.location.reload()}>Reload page</button>
      </main>;
    }
    return this.props.children;
  }
}
