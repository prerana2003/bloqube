import _ from "lodash";
export const calculateTrialCost = (trialDetail) => {
  let fixedCost,
    variableCost = 0;
  if (trialDetail) {
   let subjectsNumber= trialDetail?.totalSubjectNumber
    fixedCost =
      parseFloat(trialDetail?.fixedCost?.croCost) +
      parseFloat(trialDetail?.fixedCost?.drugCostPerPatient) *
      subjectsNumber +
      parseFloat(trialDetail?.fixedCost?.equipmentLease) +
      parseFloat(trialDetail?.fixedCost?.indFees) +
      parseFloat(trialDetail?.fixedCost?.regulatoryFees) +
      parseFloat(trialDetail?.fixedCost?.milestonePayment) +
      parseFloat(trialDetail?.fixedCost?.investigatorMeeting);
    _.each(trialDetail?.fixedCost?.otherCosts, (otherCost) => {
      fixedCost += otherCost.cost;
    });

    variableCost =
      parseFloat(trialDetail?.variableCost?.cro) * subjectsNumber +
      parseFloat(trialDetail?.variableCost?.drugDeliveryCost) * subjectsNumber +
      parseFloat(trialDetail?.variableCost?.patientVisit) * subjectsNumber +
      parseFloat(trialDetail?.variableCost?.milestonePayment);
    _.each(trialDetail?.variableCost?.otherCosts, (otherCost) => {
      variableCost += otherCost.cost;
    });
  }

  return {
    fixedCost,
    variableCost,
  };
};

export const calculateSiteCost = (siteList) => {
  if (siteList) {
    let cost = 0;
    _.each(siteList, (site) => {
      let subjectsNumber = site?.totalSubjects
      cost +=
        parseFloat(site?.variableCost?.perPatientCost)*subjectsNumber +
        parseFloat(site?.variableCost?.asSaeUpCost)*subjectsNumber +
        parseFloat(site?.variableCost?.travelCost)*subjectsNumber +
        parseFloat(site?.variableCost?.diagnositcsCost)*subjectsNumber +
        parseFloat(site?.variableCost?.imaging)*subjectsNumber +
        parseFloat(site?.variableCost?.courierCost)*subjectsNumber +
        parseFloat(site?.variableCost?.milestonePayment);

      _.each(site?.variableCost?.otherCosts, (otherCost) => {
        cost += parseFloat(otherCost.cost);
      });

      cost +=
        parseFloat(site?.fixedCost?.irbFees) +
        parseFloat(site?.fixedCost?.regulatoryFees) +
        parseFloat(site?.fixedCost?.courierFees) +
        parseFloat(site?.fixedCost?.personalCost) +
        parseFloat(site?.fixedCost?.milesStonePayment);
      _.each(site?.fixedCost?.otherCosts, (otherCost) => {
        cost += parseFloat(otherCost.cost);
      });
    });

    return cost;
  }
  return 0;
};


export const calculateSiteCostWithVariableAndFixed = (siteList) => {
  if (siteList) {
    let fixedCost = 0;
    let variableCost = 0;
    _.each(siteList, (site) => {
      let subjectsNumber = site?.totalSubjects
       variableCost+=
        parseFloat(site?.variableCost?.perPatientCost) * subjectsNumber +
        parseFloat(site?.variableCost?.asSaeUpCost) * subjectsNumber +
        parseFloat(site?.variableCost?.travelCost) * subjectsNumber +
        parseFloat(site?.variableCost?.diagnositcsCost) * subjectsNumber +
        parseFloat(site?.variableCost?.imaging) * subjectsNumber +
        parseFloat(site?.variableCost?.courierCost) * subjectsNumber +
        parseFloat(site?.variableCost?.milestonePayment);

      _.each(site?.variableCost?.otherCosts, (otherCost) => {
        variableCost += parseFloat(otherCost.cost);
      });

      fixedCost+=
        parseFloat(site?.fixedCost?.irbFees) +
        parseFloat(site?.fixedCost?.regulatoryFees) +
        parseFloat(site?.fixedCost?.courierFees) +
        parseFloat(site?.fixedCost?.personalCost) +
        parseFloat(site?.fixedCost?.milesStonePayment);
      _.each(site?.fixedCost?.otherCosts, (otherCost) => {
        fixedCost += parseFloat(otherCost.cost);
      });
    });

    return {fixedCost, variableCost, totalCost: fixedCost + variableCost};
  }
  return 0;
};



export const calculateSingleSiteCost = (site) => {
  if (site) {
    let fixedCost = 0;
    let variableCost = 0;
    if (site?.variableCost) {
      let subjectsNumber = site?.totalSubjects
      variableCost =
        parseFloat(site?.variableCost?.perPatientCost)*subjectsNumber +
        parseFloat(site?.variableCost?.asSaeUpCost)*subjectsNumber +
        parseFloat(site?.variableCost?.travelCost)*subjectsNumber +
        parseFloat(site?.variableCost?.diagnositcsCost)*subjectsNumber +
        parseFloat(site?.variableCost?.imaging)*subjectsNumber +
        parseFloat(site?.variableCost?.courierCost)*subjectsNumber +
        parseFloat(site?.variableCost?.milestonePayment);

      _.each(site.variableCost?.otherCosts, (otherCost) => {
        variableCost += parseFloat(otherCost.cost);
      });
    }

    if (site?.fixedCost) {
      fixedCost =
        parseFloat(site?.fixedCost?.irbFees) +
        parseFloat(site?.fixedCost?.regulatoryFees) +
        parseFloat(site?.fixedCost?.courierFees) +
        parseFloat(site?.fixedCost?.personalCost) +
        parseFloat(site?.fixedCost?.milesStonePayment);

      _.each(site.fixedCost?.otherCosts, (otherCost) => {
        fixedCost += parseFloat(otherCost.cost);
      });
    }

    return { fixedCost, variableCost, totalCost: fixedCost + variableCost };
  }
  return 0;
};

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getUserRole = (user, trialId, siteId) => {
  if (user) {
    const userDetails = user?.details;
    for (let i = 0; i < userDetails?.length; i++) {
      const userDetailRoleArray = userDetails[i];
      if (trialId && siteId) {
        const roleUser = _.find(userDetailRoleArray, (userDetailData) => {
          return userDetailData.trialId == trialId && userDetailData.siteId == siteId
        });
        if (roleUser) {
          return roleUser.role;
        } else {
          const sponsorUser = _.find(userDetailRoleArray, (userDetailData) => {
            return userDetailData.role == 'sponsor'
          });
          if(sponsorUser){
            return sponsorUser.role;
          }
        }
      }else{
        const indUser = _.find(userDetailRoleArray, (userDetailData) => {
          return !userDetailData.trialId && !userDetailData.siteId
        });
        if(indUser){
          return indUser.role;
        }else{
          //Take first one and return
          return userDetailRoleArray[0].role;
        }
      }
    }
  }
  return "";
};

export const base64ImageToBlob=(str)=> {
  // extract content type and base64 payload from original string
  const pos = str?.indexOf(";base64,");
  const type = str?.substring(5, pos);
  const b64 = str?.substr(pos + 8);

  // decode base64
  const imageContent = atob(b64);

  // create an ArrayBuffer and a view (as unsigned 8-bit)
  const buffer = new ArrayBuffer(imageContent?.length);
  const view = new Uint8Array(buffer);

  // fill the view, using the decoded base64
  for (let n = 0; n < imageContent?.length; n++) {
    view[n] = imageContent?.charCodeAt(n);
  }

  // convert ArrayBuffer to Blob
  const blob = new Blob([buffer], { type: type});

  return blob;
}

export const transformObjectToArray=(data)=> {
  const result = Object.keys(data)
    .filter(key => key.match(/^(\D+)(?:-(\d+))?$/)) // Match keys with a pattern like "text" or "text-n"
    .reduce((acc, key) => {
      const [, originalKey, index] = key.match(/^(\D+)(?:-(\d+))?$/);
      const currentIndex = index || 0;

      if (!acc[currentIndex]) {
        acc[currentIndex] = {};
      }
      acc[currentIndex][originalKey] = data[key];
      return acc;
    }, []);

  return result.filter(item => item); // Filter out undefined items
}

export const createNewFields = (fields, index) => {
  return fields?.map((field) => {
    const newField = _.cloneDeep(field);
    newField.key = `${field.key}-${index}`;
    if (newField.fields && newField.fields.length > 0) {
      newField.fields = createNewFields(newField.fields, index);
    }
    return newField;
  });
};

export const getFieldFromConfig = (obj, targetValue) => {
  for (const key in obj) {
    if (obj[key] === targetValue) {
      return obj.fields;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      const result = getFieldFromConfig(obj[key], targetValue);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export function findObjectByValue(
  obj,
  targetValue,
  path = [],
  childObjToBeAdd,
  originalObj
) {
  for (const key in obj) {
    if (obj[key] === targetValue) {
      const configFields = getFieldFromConfig(originalObj, targetValue);
      const newFields = createNewFields(
        configFields,
        obj.fields.length + 1
      );
      newFields.map((fe) => {
        obj.fields.push(fe);
      });
      return obj;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // Continue searching in the nested object
      const result = findObjectByValue(
        obj[key],
        targetValue,
        [...path, key],
        childObjToBeAdd,
        originalObj
      );
      if (result) {
        return result;
      }
    }
  }
  // Value not found in the current object
  return null;
}

export const findObjectByKey = (obj, targetValue, path = []) => {
  for (const key in obj) {
    if (key === targetValue) {
      return obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // Continue searching in the nested object
      const result = findObjectByValue(
        obj[key],
        targetValue,
        [...path, key],
      );
      if (result) {
        return result;
      }
    }
  }
  // Value not found in the current object
  return null;
}

export function convertToTitleCase(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function convertArrayToTitleCase(arr) {
  return arr.map(convertToTitleCase);
}

function stringToHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
}

export function generateColorHex(username) {
   const hash = stringToHash(username);
   const color = intToRGB(hash);
   return "#" + color;
}

