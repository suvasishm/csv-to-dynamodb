"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var credential_providers_1 = require("@aws-sdk/credential-providers");
var fs = require("fs");
var csv = require("csv-parser");
var client = new client_dynamodb_1.DynamoDBClient({
    region: 'us-east-1',
    credentials: (0, credential_providers_1.fromIni)({ profile: 'shs.com-staging' })
});
var ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
var tableName = 'development-shs-appliance-cost-data'; // Change to your DynamoDB table name
var importData = function (filePath) {
    var items = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', function (row) {
        items.push(row);
    })
        .on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('CSV file successfully processed');
                    return [4 /*yield*/, insertItems(items)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var insertItems = function (items) { return __awaiter(void 0, void 0, void 0, function () {
    var i, _i, items_1, item, params, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 1;
                _i = 0, items_1 = items;
                _a.label = 1;
            case 1:
                if (!(_i < items_1.length)) return [3 /*break*/, 8];
                item = items_1[_i];
                params = {
                    TableName: tableName,
                    Item: item,
                };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, ddbDocClient.send(new lib_dynamodb_1.PutCommand(params))];
            case 3:
                _a.sent();
                console.log("Inserted item ".concat(i++, ": ").concat(JSON.stringify(item)));
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error("Error inserting item: ".concat(JSON.stringify(item), " - ").concat(error_1));
                throw error_1;
            case 5: return [4 /*yield*/, delay(250)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8: return [2 /*return*/];
        }
    });
}); };
var insertItemsInBatches = function (items) { return __awaiter(void 0, void 0, void 0, function () {
    var chunkSize, i, chunk, params, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                chunkSize = 25;
                i = 0;
                _b.label = 1;
            case 1:
                if (!(i < items.length)) return [3 /*break*/, 8];
                chunk = items.slice(i, i + chunkSize);
                params = {
                    RequestItems: (_a = {},
                        _a[tableName] = chunk.map(function (item) { return ({
                            PutRequest: {
                                Item: item
                            }
                        }); }),
                        _a)
                };
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(params))];
            case 3:
                _b.sent();
                console.log("Inserted batch: ".concat(i / chunkSize + 1));
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error("Error inserting batch: ".concat(i / chunkSize + 1, " - ").concat(error_2));
                return [3 /*break*/, 5];
            case 5: 
            // Add 500ms delay between each batch
            return [4 /*yield*/, delay(2000)];
            case 6:
                // Add 500ms delay between each batch
                _b.sent();
                _b.label = 7;
            case 7:
                i += chunkSize;
                return [3 /*break*/, 1];
            case 8: return [2 /*return*/];
        }
    });
}); };
// Specify the path to your CSV file here
var filePath = './replacementCostData.csv'; // Change to the path of your CSV file
importData(filePath);
