const transferExactAmountPromise = (from, to, _eth) => {
  const tx = {
    from,
    to,
    value: web3.toWei(_eth, 'ether'),
  };

  const gasEstimate = web3.eth.estimateGas(tx);
  const newTx = Object.assign({}, tx, { value: tx.value - gasEstimate });
  return web3.eth.sendTransactionPromise(newTx);
};

const getInvestorData = (fundStorageInstance, investor) => fundStorageInstance.getInvestor.call(investor)
  .then((_investorData) => {
    const [investorType, amountPendingSubscription, sharesOwned, shareClass, sharesPendingRedemption, amountPendingWithdrawal] = _investorData.map(x => Number(x));
    const investorData = { investorType, amountPendingSubscription, sharesOwned, shareClass, sharesPendingRedemption, amountPendingWithdrawal };
    return investorData;
  })
  .catch(err => assert.throw(`Error getInvestorData: ${err.toString()}`));

const hexToString = (hex) => {
  var string = '';
  for (var i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
};

const getContractNumericalData = (label, contractInstance, fields) => Promise.all(fields.map(_field => contractInstance[_field].call()))
  .then((vals) => {
    const result = {};
    vals.forEach((_val, index) => {
      result[fields[index]] = Number(_val);
    });
    console.log(`${label} Details`);
    console.log(result);
    return;
  })
  .catch(err => assert.throw(`Error getting contract field data: ${err.toString()}`));

module.exports = {
  transferExactAmountPromise,
  getInvestorData,
  getContractNumericalData,
};
