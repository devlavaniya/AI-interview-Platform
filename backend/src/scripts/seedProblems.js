import mongoose from "mongoose";
import dotenv from "dotenv";

import Problem from "../models/Problem.js";
import User from "../models/User.js";

dotenv.config();

const problems = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",

    description: {
      text: "Given an array of integers and a target value, find two different elements whose values add up to the target.",
      notes: [
        "There is exactly one valid pair.",
        "You cannot use the same element twice.",
      ],
    },

    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "2 + 7 = 9.",
      },
    ],

    constraints: [
      "2 <= nums.length <= 10000",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
    ],

    starterCode: {
      python: `def solve(nums, target):
    pass`,

      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}`,

      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        return {};
    }
};`,
    },

    expectedOutput: {
      python: "[0,1]",
      java: "[0,1]",
      cpp: "[0,1]",
    },
  },

  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Array",

    description: {
      text: "Given an integer array, determine whether any value appears more than once.",
      notes: [
        "Return true when a duplicate exists.",
        "Return false when every value is unique.",
      ],
    },

    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "The value 1 appears twice.",
      },
    ],

    constraints: ["1 <= nums.length <= 100000", "-10^9 <= nums[i] <= 10^9"],

    starterCode: {
      python: `def solve(nums):
    pass`,

      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        return false;
    }
}`,

      cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        return false;
    }
};`,
    },

    expectedOutput: {
      python: "true",
      java: "true",
      cpp: "true",
    },
  },

  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",

    description: {
      text: "Given two strings, determine whether one string can be formed by rearranging the characters of the other.",
      notes: [
        "Character frequencies must match.",
        "Both strings contain lowercase English letters.",
      ],
    },

    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation: "Both strings contain the same characters.",
      },
    ],

    constraints: ["1 <= s.length, t.length <= 50000"],

    starterCode: {
      python: `def solve(s, t):
    pass`,

      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        return false;
    }
}`,

      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        return false;
    }
};`,
    },

    expectedOutput: {
      python: "true",
      java: "true",
      cpp: "true",
    },
  },

  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",

    description: {
      text: "Given a string containing brackets, determine whether all brackets are correctly matched and nested.",
      notes: [
        "Valid pairs are (), {}, and [].",
        "A closing bracket must match the most recent opening bracket.",
      ],
    },

    examples: [
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets are correctly matched.",
      },
    ],

    constraints: ["1 <= s.length <= 10000"],

    starterCode: {
      python: `def solve(s):
    pass`,

      java: `class Solution {
    public boolean isValid(String s) {
        return false;
    }
}`,

      cpp: `class Solution {
public:
    bool isValid(string s) {
        return false;
    }
};`,
    },

    expectedOutput: {
      python: "true",
      java: "true",
      cpp: "true",
    },
  },

  {
    id: "best-time-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",

    description: {
      text: "Given daily stock prices, find the maximum profit possible by buying once and selling later.",
      notes: [
        "You must buy before selling.",
        "Return 0 if no profit is possible.",
      ],
    },

    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy at 1 and sell at 6.",
      },
    ],

    constraints: ["1 <= prices.length <= 100000", "0 <= prices[i] <= 100000"],

    starterCode: {
      python: `def solve(prices):
    pass`,

      java: `class Solution {
    public int maxProfit(int[] prices) {
        return 0;
    }
}`,

      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        return 0;
    }
};`,
    },

    expectedOutput: {
      python: "5",
      java: "5",
      cpp: "5",
    },
  },

  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",

    description: {
      text: "Find the contiguous subarray having the largest possible sum.",
      notes: [
        "The subarray must contain at least one element.",
        "Elements must be contiguous.",
      ],
    },

    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has sum 6.",
      },
    ],

    constraints: ["1 <= nums.length <= 100000", "-10^4 <= nums[i] <= 10^4"],

    starterCode: {
      python: `def solve(nums):
    pass`,

      java: `class Solution {
    public int maxSubArray(int[] nums) {
        return 0;
    }
}`,

      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        return 0;
    }
};`,
    },

    expectedOutput: {
      python: "6",
      java: "6",
      cpp: "6",
    },
  },

  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",

    description: {
      text: "Given a sorted array and a target value, return the index of the target or -1 when it is not present.",
      notes: [
        "The array is sorted in ascending order.",
        "Binary search provides an efficient solution.",
      ],
    },

    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 is located at index 4.",
      },
    ],

    constraints: ["1 <= nums.length <= 100000", "-10^9 <= nums[i] <= 10^9"],

    starterCode: {
      python: `def solve(nums, target):
    pass`,

      java: `class Solution {
    public int search(int[] nums, int target) {
        return -1;
    }
}`,

      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        return -1;
    }
};`,
    },

    expectedOutput: {
      python: "4",
      java: "4",
      cpp: "4",
    },
  },

  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",

    description: {
      text: "Given the head of a singly linked list, reverse the links and return the new head.",
      notes: ["The list can be reversed iteratively or recursively."],
    },

    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The direction of every link is reversed.",
      },
    ],

    constraints: ["0 <= number of nodes <= 5000", "-5000 <= Node.val <= 5000"],

    starterCode: {
      python: `def solve(head):
    pass`,

      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        return null;
    }
}`,

      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        return nullptr;
    }
};`,
    },

    expectedOutput: {
      python: "[5,4,3,2,1]",
      java: "[5,4,3,2,1]",
      cpp: "[5,4,3,2,1]",
    },
  },

  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",

    description: {
      text: "There are n stairs. At each move you can climb either one or two stairs. Find the number of different ways to reach the top.",
      notes: ["The order of moves matters."],
    },

    examples: [
      {
        input: "n = 3",
        output: "3",
        explanation: "The possible sequences are 1+1+1, 1+2 and 2+1.",
      },
    ],

    constraints: ["1 <= n <= 45"],

    starterCode: {
      python: `def solve(n):
    pass`,

      java: `class Solution {
    public int climbStairs(int n) {
        return 0;
    }
}`,

      cpp: `class Solution {
public:
    int climbStairs(int n) {
        return 0;
    }
};`,
    },

    expectedOutput: {
      python: "3",
      java: "3",
      cpp: "3",
    },
  },

  {
    id: "majority-element",
    title: "Majority Element",
    difficulty: "Easy",
    category: "Array",

    description: {
      text: "Find the element that appears more than half of the time in an integer array.",
      notes: ["A majority element is guaranteed to exist."],
    },

    examples: [
      {
        input: "nums = [2,2,1,1,1,2,2]",
        output: "2",
        explanation: "2 appears more than half of the time.",
      },
    ],

    constraints: ["1 <= nums.length <= 50000"],

    starterCode: {
      python: `def solve(nums):
    pass`,

      java: `class Solution {
    public int majorityElement(int[] nums) {
        return 0;
    }
}`,

      cpp: `class Solution {
public:
    int majorityElement(vector<int>& nums) {
        return 0;
    }
};`,
    },

    expectedOutput: {
      python: "2",
      java: "2",
      cpp: "2",
    },
  },

  {
    id: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    category: "Array",

    description: {
      text: "Move all zero values to the end of the array while keeping the relative order of non-zero elements unchanged.",
      notes: [
        "Modify the array in place.",
        "Do not change the order of non-zero values.",
      ],
    },

    examples: [
      {
        input: "nums = [0,1,0,3,12]",
        output: "[1,3,12,0,0]",
        explanation: "All non-zero values retain their original order.",
      },
    ],

    constraints: ["1 <= nums.length <= 10000"],

    starterCode: {
      python: `def solve(nums):
    pass`,

      java: `class Solution {
    public void moveZeroes(int[] nums) {
    }
}`,

      cpp: `class Solution {
public:
    void moveZeroes(vector<int>& nums) {
    }
};`,
    },

    expectedOutput: {
      python: "[1,3,12,0,0]",
      java: "[1,3,12,0,0]",
      cpp: "[1,3,12,0,0]",
    },
  },

  {
    id: "product-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array",

    description: {
      text: "For every position, calculate the product of all array elements except the element at that position.",
      notes: ["Do not use division.", "Try to solve it in linear time."],
    },

    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation: "Each output contains the product of all other values.",
      },
    ],

    constraints: ["2 <= nums.length <= 100000", "-30 <= nums[i] <= 30"],

    starterCode: {
      python: `def solve(nums):
    pass`,

      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        return new int[]{};
    }
}`,

      cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        return {};
    }
};`,
    },

    expectedOutput: {
      python: "[24,12,8,6]",
      java: "[24,12,8,6]",
      cpp: "[24,12,8,6]",
    },
  },

  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",

    description: {
      text: "Find the length of the longest contiguous substring that contains no repeated characters.",
      notes: [
        "The substring must be contiguous.",
        "Each character may appear only once in the selected substring.",
      ],
    },

    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The substring "abc" has length 3.',
      },
    ],

    constraints: ["0 <= s.length <= 50000"],

    starterCode: {
      python: `def solve(s):
    pass`,

      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        return 0;
    }
}`,

      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        return 0;
    }
};`,
    },

    expectedOutput: {
      python: "3",
      java: "3",
      cpp: "3",
    },
  },

  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graph",

    description: {
      text: "Given a grid containing land and water, count the number of separate connected groups of land.",
      notes: [
        "Cells connect vertically and horizontally.",
        "Diagonal cells are not considered connected.",
      ],
    },

    examples: [
      {
        input: "grid = [[1,1,0],[1,0,0],[0,0,1]]",
        output: "2",
        explanation: "There are two separate connected land groups.",
      },
    ],

    constraints: ["1 <= rows, columns <= 300", "Grid contains only 0 and 1."],

    starterCode: {
      python: `def solve(grid):
    pass`,

      java: `class Solution {
    public int numIslands(int[][] grid) {
        return 0;
    }
}`,

      cpp: `class Solution {
public:
    int numIslands(vector<vector<int>>& grid) {
        return 0;
    }
};`,
    },

    expectedOutput: {
      python: "2",
      java: "2",
      cpp: "2",
    },
  },

  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Sorting",

    description: {
      text: "Given a collection of intervals, merge all intervals that overlap.",
      notes: [
        "Each interval is represented as [start, end].",
        "The final result must contain no overlapping intervals.",
      ],
    },

    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[9,12]]",
        output: "[[1,6],[8,12]]",
        explanation: "Overlapping intervals are combined.",
      },
    ],

    constraints: [
      "1 <= intervals.length <= 10000",
      "0 <= start <= end <= 100000",
    ],

    starterCode: {
      python: `def solve(intervals):
    pass`,

      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        return new int[][]{};
    }
}`,

      cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        return {};
    }
};`,
    },

    expectedOutput: {
      python: "[[1,6],[8,12]]",
      java: "[[1,6],[8,12]]",
      cpp: "[[1,6],[8,12]]",
    },
  },

  {
    id: "search-rotated-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",

    description: {
      text: "Search for a target value in a sorted array that has been rotated at an unknown position.",
      notes: [
        "All values are distinct.",
        "Return the target index when found.",
        "Return -1 when the target is absent.",
      ],
    },

    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "The target 0 is at index 4.",
      },
    ],

    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values are distinct.",
    ],

    starterCode: {
      python: `def solve(nums, target):
    pass`,

      java: `class Solution {
    public int search(int[] nums, int target) {
        return -1;
    }
}`,

      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        return -1;
    }
};`,
    },

    expectedOutput: {
      python: "4",
      java: "4",
      cpp: "4",
    },
  },
];

/*
|--------------------------------------------------------------------------
| Seed
|--------------------------------------------------------------------------
*/

async function seedProblems() {
  try {
    const mongoUri = process.env.DB_URL || process.env.MONGODB_URL;

    if (!mongoUri) {
      throw new Error("DB_URL or MONGODB_URL is missing from .env");
    }

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connected");

    /*
     * Find an existing user.
     */

    const user = await User.findOne();

    if (!user) {
      throw new Error(
        "❌ No User found. Please login/register once before running the seed script.",
      );
    }

    console.log(`👤 Using user: ${user.name} (${user.email})`);

    /*
     * Insert/update problems.
     */

    for (const problem of problems) {
      await Problem.findOneAndUpdate(
        { id: problem.id },
        {
          ...problem,
          createdBy: user._id,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );

      console.log(`✅ ${problem.title}`);
    }

    const count = await Problem.countDocuments();

    console.log(`\n🎉 Problem seeding completed.`);

    console.log(`📚 Total problems in database: ${count}`);
  } catch (error) {
    console.error("\n❌ Seed error:", error.message);
  } finally {
    await mongoose.disconnect();

    console.log("🔌 MongoDB disconnected");
  }
}

seedProblems();
