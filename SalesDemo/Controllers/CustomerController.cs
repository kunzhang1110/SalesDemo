using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesDemo.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesDemo.Controllers
{
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;
        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> Get()
        {
            var customers = await _context.Customers.ToListAsync();
            if (customers.Count == 0)
            {
                customers.Add(new Customer());
            }
            return customers;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> Get(int id)
        {
            var customer = await _context.Customers.Where(c => c.Id == id).SingleOrDefaultAsync();
            if (customer == null)
            {
                return NotFound();
            }
            return customer;
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> Post([FromBody]Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Customer), customer);

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Customer>> Put(int id, [FromBody]Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var customerInDb = await _context.Customers.Where(c => c.Id == id).SingleOrDefaultAsync();
            if (customerInDb == null)
            {
                return NotFound();
            }

            customerInDb.Name = customer.Name;
            customerInDb.Address = customer.Address;
            customerInDb.Sale = customer.Sale;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Customer>> Delete(int id)
        {
            var customer = await _context.Customers.Where(c => c.Id == id).SingleOrDefaultAsync();
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
