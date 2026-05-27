export const WinMessage = ({ moves, onReset }) => {
  return (
    <div className="overlay" onClick={onReset}>
      <div className="win-message">
        <h2>Congratulations!</h2>
        <p>You completed the game in {moves} moves!</p>
      </div>
    </div>
  );
};