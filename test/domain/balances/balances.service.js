const chai = require('chai');
const {expect} = chai;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const ExceededDepositLimit = require('../../../src/domain/errors/ExceededDepositLimit.error');
const ReceiverProfileNotFound = require('../../../src/domain/errors/ReceiverProfileNotFound.error');

const payerProfile = {
  type: 'client',
  id: 1,
}

const receiver = {
  id: 2,
  balance: 200,
}

const getProfileById = sinon.stub().resolves(receiver);


const sequelize = {
    transaction: () => Promise.resolve({
        LOCK: {
          UPDATE: 'update',
        },
        commit: () => Promise.resolve(),
        rollback: () => Promise.resolve(),
    }),
}

describe('Balances Service', async ()=>{
    it('should fail when amount to deposit is greater than deposit limit', async ()=>{
        const amount = 300;
        const amountToPay = 40;
        const getPriceOfJobsInProgressByClient = sinon.stub().resolves(amountToPay);

        const balancesService = proxyquire('../../../src/domain/balances/balances.service',{
            '../../infrastructure/repositories/jobs.repository':{
                getPriceOfJobsInProgressByClient
            },
            '../../infrastructure/repositories/profile.repository':{
                getProfileById: null
            },
            '../profile/profile.service':{
                updateBalance:null
            },
            '../../infrastructure/model':{
                sequelize
            }
        })  
        const depositLimit = amountToPay * 0.25
        const expectedError = new ExceededDepositLimit(depositLimit)

        try{
            await balancesService.depositMoney({profile:payerProfile, userId: receiver.id, amount})
            expect.fail()
        }catch(err){
            expect(err.message).to.eql(expectedError.message)
            expect(err.code).to.eql(expectedError.code)
        }
    })

    it('should deposit money when amount is less than deposit limit', async ()=>{
        const amount = 30;
        const amountToPay = 400;
        const updateBalance = sinon.stub().resolves({
            ...receiver,
            balance: receiver.balance + amount,
        });
        const getPriceOfJobsInProgressByClient = sinon.stub().resolves(amountToPay);
        const balancesService = proxyquire('../../../src/domain/balances/balances.service',{
            '../../infrastructure/repositories/jobs.repository':{
                getPriceOfJobsInProgressByClient
            },
            '../../infrastructure/repositories/profile.repository':{
                getProfileById,
            },
            '../profile/profile.service':{
                updateBalance
            },
            '../../infrastructure/model':{
                sequelize
            }
        }) 

        const result = await balancesService.depositMoney({profile:payerProfile, userId: receiver.id, amount});
        expect(result.balance).to.be.eql(receiver.balance + amount);
        expect(getProfileById.firstCall.args[0]).to.be.eql(receiver.id);
        expect(updateBalance.firstCall.args[0]).to.be.eql(receiver.id);
        expect(updateBalance.firstCall.args[1]).to.be.eql(amount);
    })

    it('should throw an error if the receiver profile is not found', async ()=>{
        const amount = 30;
        const amountToPay = 400;
        const getPriceOfJobsInProgressByClient = sinon.stub().resolves(amountToPay);

        const balancesService = proxyquire('../../../src/domain/balances/balances.service',{
            '../../infrastructure/repositories/jobs.repository':{
                getPriceOfJobsInProgressByClient
            },
            '../../infrastructure/repositories/profile.repository':{
                getProfileById: sinon.fake.resolves(null)
            },
            '../profile/profile.service':{
                updateBalance:null
            },
            '../../infrastructure/model':{
                sequelize
            }
        })  
        const expectedError = new ReceiverProfileNotFound();
        try{
            await balancesService.depositMoney({profile:payerProfile, userId: receiver.id, amount})
            expect.fail()
        }catch(err){
            expect(err.message).to.eql(expectedError.message)
            expect(err.code).to.eql(expectedError.code)
        }
    })
})